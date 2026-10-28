#!/usr/bin/env node
// Plans (and with --apply writes) the Koobiq block in AGENTS.md / CLAUDE.md
// and, with --share, the marketplace registration in .claude/settings.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const BLOCK_FILE = path.join(PLUGIN_ROOT, 'skills', 'init', 'agents-block.md');

const SNIPPET_FILE = path.join(
  PLUGIN_ROOT,
  'skills',
  'init',
  'settings-snippet.json'
);

const BEGIN_RE = /<!-- koobiq:begin\b[^>]*-->/g;
const END = '<!-- koobiq:end -->';
const EX_BEGIN = '<!-- koobiq:exceptions:begin -->';
const EX_END = '<!-- koobiq:exceptions:end -->';

const read = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const eol = (text) => (text && text.includes('\r\n') ? '\r\n' : '\n');

/** Picks the file to write, following how Claude Code loads instruction files. */
export function chooseTarget(root, explicit) {
  const has = (rel) => fs.existsSync(path.join(root, rel));

  const files = {
    agents: has('AGENTS.md'),
    claude: has('CLAUDE.md'),
    dotClaude: has(path.join('.claude', 'CLAUDE.md')),
    local: has('CLAUDE.local.md'),
  };

  const notes = [];

  if (explicit) return { target: explicit, files, notes };

  if (files.agents) {
    const claude =
      read(path.join(root, 'CLAUDE.md')) ||
      read(path.join(root, '.claude', 'CLAUDE.md'));

    if (
      (files.claude || files.dotClaude) &&
      !/(^|\s)@AGENTS\.md\b/.test(claude || '')
    ) {
      notes.push(
        'CLAUDE.md exists without an @AGENTS.md import, so Claude Code reads CLAUDE.md only. Add "@AGENTS.md" at its top.'
      );
    }

    return { target: 'AGENTS.md', files, notes };
  }

  if (files.claude) {
    notes.push(
      'Only CLAUDE.md exists. Consider moving shared rules to AGENTS.md (read by other agents too) and importing it from CLAUDE.md with "@AGENTS.md".'
    );

    return { target: 'CLAUDE.md', files, notes };
  }

  notes.push(
    'No instruction file yet: AGENTS.md will be created (Claude Code 2.1.277+ reads it when there is no CLAUDE.md).'
  );

  return { target: 'AGENTS.md', files, notes };
}

/** Returns { action, text } for inserting or refreshing the block. */
export function renderBlock(existing, blockTemplate) {
  const nl = eol(existing);
  const template = blockTemplate.replace(/\r?\n/g, nl).trimEnd();

  if (existing == null) return { action: 'create', text: `${template}${nl}` };

  const begins = [...existing.matchAll(BEGIN_RE)];
  const ends = existing.split(END).length - 1;

  if (begins.length === 0 && ends === 0) {
    const separator = existing.endsWith(nl) ? nl : `${nl}${nl}`;

    return {
      action: 'append',
      text: `${existing}${separator}${template}${nl}`,
    };
  }

  if (begins.length !== 1 || ends !== 1)
    return { action: 'conflict', text: existing };

  const start = begins[0].index;
  const end = existing.indexOf(END) + END.length;

  if (end < start) return { action: 'conflict', text: existing };

  const current = existing.slice(start, end);
  const keep = current.match(new RegExp(`${EX_BEGIN}([\\s\\S]*?)${EX_END}`));

  const block = keep
    ? template.replace(
        new RegExp(`${EX_BEGIN}[\\s\\S]*?${EX_END}`),
        `${EX_BEGIN}${keep[1]}${EX_END}`
      )
    : template;

  const text = `${existing.slice(0, start)}${block}${existing.slice(end)}`;

  return { action: text === existing ? 'unchanged' : 'update', text };
}

const isObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value);

/** Deep-merges the marketplace snippet into existing settings (existing values win). */
export function mergeSettings(existing, snippet) {
  const merge = (target, source) => {
    const out = { ...target };

    for (const [key, value] of Object.entries(source)) {
      out[key] =
        isObject(value) && isObject(out[key])
          ? merge(out[key], value)
          : (out[key] ?? value);
    }

    return out;
  };

  return merge(existing || {}, snippet);
}

const simpleDiff = (before, after) => {
  const a = (before || '').split(/\r?\n/);
  const b = after.split(/\r?\n/);
  let start = 0;

  while (start < a.length && start < b.length && a[start] === b[start])
    start += 1;

  let endA = a.length - 1;
  let endB = b.length - 1;

  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA -= 1;
    endB -= 1;
  }

  return [
    `@@ line ${start + 1} @@`,
    ...a.slice(start, endA + 1).map((line) => `- ${line}`),
    ...b.slice(start, endB + 1).map((line) => `+ ${line}`),
  ].join('\n');
};

export function planInit({ root, target: explicit, share = false }) {
  const { target, files, notes } = chooseTarget(root, explicit);
  const file = path.join(root, target);
  const existing = read(file);
  const { action, text } = renderBlock(existing, read(BLOCK_FILE));

  const plan = {
    root: root.split(path.sep).join('/'),
    target,
    files,
    action,
    notes,
    ...(action !== 'unchanged' &&
      action !== 'conflict' && { diff: simpleDiff(existing, text) }),
  };

  if (action === 'conflict') {
    plan.notes.push(
      `${target} has missing or duplicate koobiq markers; fix them by hand, then re-run.`
    );
  }

  if (share) {
    const settingsFile = path.join(root, '.claude', 'settings.json');
    const raw = read(settingsFile);
    let current = {};

    try {
      current = raw ? JSON.parse(raw) : {};
    } catch {
      plan.settings = {
        action: 'conflict',
        file: '.claude/settings.json',
        note: 'settings.json is not valid JSON',
      };

      return { plan, text, existing };
    }

    const merged = mergeSettings(current, JSON.parse(read(SNIPPET_FILE)));
    const output = `${JSON.stringify(merged, null, 2)}\n`;

    plan.settings = {
      file: '.claude/settings.json',
      action: raw == null ? 'create' : output === raw ? 'unchanged' : 'update',
      content: merged,
    };

    plan.settingsText = output;
  }

  return { plan, text, existing };
}

function main() {
  const args = process.argv.slice(2);

  const option = (name) => {
    const index = args.indexOf(`--${name}`);

    return index === -1 ? undefined : args[index + 1];
  };

  const root = path.resolve(option('root') || process.cwd());

  const { plan, text } = planInit({
    root,
    target: option('target'),
    share: args.includes('--share'),
  });

  if (args.includes('--apply')) {
    if (
      plan.action === 'create' ||
      plan.action === 'append' ||
      plan.action === 'update'
    ) {
      fs.writeFileSync(path.join(root, plan.target), text);
      plan.written = [plan.target];
    }

    if (
      plan.settings &&
      (plan.settings.action === 'create' || plan.settings.action === 'update')
    ) {
      fs.mkdirSync(path.join(root, '.claude'), { recursive: true });

      fs.writeFileSync(
        path.join(root, '.claude', 'settings.json'),
        plan.settingsText
      );

      plan.written = [...(plan.written || []), plan.settings.file];
    }
  }

  delete plan.settingsText;
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  if (plan.action === 'conflict') process.exitCode = 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
