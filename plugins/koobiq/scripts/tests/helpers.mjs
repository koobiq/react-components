import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { clearKnowledgeCache } from '../../lint/koobiq-core.mjs';
import { runCheck } from '../lib/engine.mjs';

export const TESTS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES = path.join(TESTS_DIR, 'fixtures');
export const PLUGIN_ROOT = path.resolve(TESTS_DIR, '..', '..');
export const REPO_ROOT = path.resolve(PLUGIN_ROOT, '..', '..');
export const CLI = path.join(PLUGIN_ROOT, 'scripts', 'koobiq-check.mjs');

const require = createRequire(import.meta.url);

export const REPO_TYPESCRIPT = (() => {
  try {
    return path.dirname(require.resolve('typescript/package.json'));
  } catch {
    return null;
  }
})();

const STUBS = [
  'react-components',
  'design-tokens',
  'react-icons',
  'react-core',
  'react-primitives',
];

/** Copies the stub @koobiq packages into <dir>/node_modules. */
export function installStubs(dir, only = STUBS) {
  for (const name of only) {
    fs.cpSync(
      path.join(FIXTURES, 'stubs', name),
      path.join(dir, 'node_modules', '@koobiq', name),
      { recursive: true }
    );
  }
}

/** Copies a fixture app to a temp dir (outside any git repo). */
export function makeApp(name, { stubs = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `koobiq-${name}-`));

  fs.cpSync(path.join(FIXTURES, name), dir, { recursive: true });
  if (stubs) installStubs(dir);

  return {
    dir,
    cleanup: () =>
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5 }),
  };
}

export function check(dir, options = {}) {
  clearKnowledgeCache();

  return runCheck({ root: dir, typescript: REPO_TYPESCRIPT, ...options });
}

const ANNOTATION_RE =
  /expect(-next-line)?:\s*([a-z0-9/,\s-]+?)\s*(?:\*\/|-->|\}|$)/i;

const walk = (dir, base = dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }

  return out;
};

/** Expected `file:line:id` keys from inline annotations and expect.json. */
export function readExpectations(dir) {
  const keys = [];

  for (const rel of walk(dir)) {
    if (rel === 'expect.json') continue;

    const lines = fs.readFileSync(path.join(dir, rel), 'utf8').split('\n');

    lines.forEach((text, index) => {
      const match = text.match(ANNOTATION_RE);

      if (!match) return;

      const line = index + 1 + (match[1] ? 1 : 0);

      for (const id of match[2].split(/[,\s]+/).filter(Boolean)) {
        keys.push(`${rel}:${line}:${id}`);
      }
    });
  }

  const extra = path.join(dir, 'expect.json');

  if (fs.existsSync(extra)) {
    for (const item of JSON.parse(fs.readFileSync(extra, 'utf8'))) {
      keys.push(`${item.file}:${item.line}:${item.id}`);
    }
  }

  return keys.sort();
}

export const actualKeys = (report) =>
  report.findings.map((f) => `${f.file}:${f.line}:${f.id}`).sort();

/** Multiset difference: what is missing and what is unexpected. */
export function diffKeys(expected, actual) {
  const count = (list) => {
    const map = new Map();

    for (const key of list) map.set(key, (map.get(key) || 0) + 1);

    return map;
  };

  const want = count(expected);
  const got = count(actual);
  const missing = [];
  const unexpected = [];

  for (const [key, n] of want) {
    for (let i = got.get(key) || 0; i < n; i++) missing.push(key);
  }

  for (const [key, n] of got) {
    for (let i = want.get(key) || 0; i < n; i++) unexpected.push(key);
  }

  return { missing, unexpected };
}
