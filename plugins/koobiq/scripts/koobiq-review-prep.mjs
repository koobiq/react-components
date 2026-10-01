#!/usr/bin/env node
// Prepares a /koobiq:review run: resolves the scope, runs koobiq-check,
// splits the files into reviewer batches and writes them to a run folder.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runCheck } from './lib/engine.mjs';
import { fileKind, git, readSource, toPosix } from './lib/util.mjs';

const PLUGIN_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const KEEP_RUNS = 5;

const USAGE = `koobiq-review-prep — prepare a Koobiq design-system review

Usage: node koobiq-review-prep.mjs [options]

Scope (default: changes against the merge-base, plus untracked files):
  --root <dir>           Project root (default: git top-level, else cwd)
  --base <ref>           Base ref for the default diff scope
  --all                  Every UI file in the project (audit)
  --paths <a,b>          These files or folders
  --components <A,B>     Files that use these Koobiq components

Batches:
  --max-files <n>        Files per batch (default 12)
  --max-lines <n>        Lines per batch (default 1500)
  --run-dir <dir>        Where to write the run (default: node_modules/.cache/koobiq/runs/<id>)

Checks:
  --typecheck            Also run the TypeScript language-service tier (slower)

Knowledge: --typescript <path>, --ds-dir <dir>, --tokens-dir <dir>
`;

function parseArgs(argv) {
  const options = { maxFiles: 12, maxLines: 1500 };

  const values = new Set([
    'root',
    'base',
    'paths',
    'components',
    'max-files',
    'max-lines',
    'run-dir',
    'typescript',
    'ds-dir',
    'tokens-dir',
  ]);

  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].replace(/^--/, '').split(/=(.*)/s);

    if (flag === 'all' || flag === 'help' || flag === 'typecheck') {
      options[flag] = true;
      continue;
    }

    if (!values.has(flag)) throw new Error(`Unknown option: ${argv[i]}`);

    let value = inline;

    if (value === undefined) {
      i += 1;
      value = argv[i];
    }

    if (value === undefined) throw new Error(`--${flag} needs a value`);

    const key = flag.replace(/-(\w)/g, (_, c) => c.toUpperCase());

    options[key] = key.startsWith('max') ? Number(value) : value;
  }

  return options;
}

/** Exceptions recorded in the Koobiq block of AGENTS.md / CLAUDE.md. */
export function readExceptions(root) {
  const exceptions = [];

  for (const name of [
    'AGENTS.md',
    'CLAUDE.md',
    path.join('.claude', 'CLAUDE.md'),
  ]) {
    let text;

    try {
      text = fs.readFileSync(path.join(root, name), 'utf8');
    } catch {
      continue;
    }

    const block = text.match(
      /<!-- koobiq:exceptions:begin -->([\s\S]*?)<!-- koobiq:exceptions:end -->/
    );

    if (!block) continue;

    for (const line of block[1].split(/\r?\n/)) {
      const match = line.match(
        /^\s*[-*]\s*allow\s+(\S+)(?:\s+in\s+(\S+))?\s*(?:[—–-]+\s*(.*))?$/
      );

      if (match) {
        exceptions.push({
          target: match[1],
          glob: match[2] || null,
          reason: (match[3] || '').trim(),
          source: name,
        });
      } else if (line.trim().replace(/^[-*]\s*/, '')) {
        exceptions.push({
          text: line.trim().replace(/^[-*]\s*/, ''),
          source: name,
        });
      }
    }
  }

  return exceptions;
}

const unitKey = (file) => {
  const dir = path.posix.dirname(file);

  const stem = path.posix
    .basename(file)
    .replace(/\.(?:module\.)?[^.]+$/, '')
    .replace(/\.module$/, '');

  return `${dir}/${stem}`;
};

/** Groups files (component + its styles together) and packs them into batches. */
export function buildBatches(
  files,
  { maxFiles = 12, maxLines = 1500, weight = () => 0 } = {}
) {
  const units = new Map();

  for (const file of files) {
    const key = unitKey(file.file);

    if (!units.has(key)) units.set(key, { files: [], lines: 0, weight: 0 });

    const unit = units.get(key);

    unit.files.push(file);
    unit.lines += file.lines;
    unit.weight += weight(file.file);
  }

  const ordered = [...units.entries()]
    .sort(([a, x], [b, y]) => y.weight - x.weight || a.localeCompare(b))
    .map(([, unit]) => unit);

  const batches = [];
  let current = null;

  for (const unit of ordered) {
    if (
      !current ||
      current.files.length + unit.files.length > maxFiles ||
      (current.lines + unit.lines > maxLines && current.files.length > 0)
    ) {
      current = { files: [], lines: 0 };
      batches.push(current);
    }

    current.files.push(...unit.files);
    current.lines += unit.lines;
  }

  return batches;
}

const defaultRunDir = (root) => {
  const id = new Date().toISOString().replace(/[:.]/g, '-');
  const modules = path.join(root, 'node_modules');

  return fs.existsSync(modules)
    ? path.join(modules, '.cache', 'koobiq', 'runs', id)
    : path.join(os.tmpdir(), 'koobiq-runs', id);
};

const pruneRuns = (runDir) => {
  const parent = path.dirname(runDir);

  try {
    const runs = fs
      .readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    for (const old of runs.slice(0, Math.max(0, runs.length - KEEP_RUNS))) {
      fs.rmSync(path.join(parent, old), { recursive: true, force: true });
    }
  } catch {
    // pruning is best effort
  }
};

const expandPaths = (root, list) => {
  const files = [];

  for (const item of list) {
    const abs = path.resolve(root, item);
    const rel = toPosix(path.relative(root, abs));
    let stat;

    try {
      stat = fs.statSync(abs);
    } catch {
      continue;
    }

    if (stat.isFile()) files.push(rel);
    else files.push(`${rel}/`);
  }

  return files;
};

export function prepare(options) {
  const gitRoot = git(
    ['rev-parse', '--show-toplevel'],
    options.root || process.cwd()
  )?.trim();

  const root = path.resolve(options.root || gitRoot || process.cwd());

  const common = {
    root,
    typescript: options.typescript,
    dsDir: options.dsDir,
    tokensDir: options.tokensDir,
    inventory: 'full',
  };

  // The language-service tier only runs on the final, scoped check.
  const scoped = { ...common, ...(options.typecheck && { typecheck: true }) };

  let report;
  let mode;

  if (options.all || options.components) {
    report = runCheck(scoped);
    mode = options.components ? 'components' : 'all';
  } else if (options.paths) {
    const requested = expandPaths(
      root,
      options.paths
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    );

    const full = runCheck({ ...common, inventory: 'none' });

    const files = full.meta.files.filter((file) =>
      requested.some((entry) =>
        entry.endsWith('/')
          ? file.startsWith(entry) || entry === './'
          : file === entry
      )
    );

    report = files.length
      ? runCheck({ ...scoped, files })
      : { ...full, findings: [], meta: { ...full.meta, files: [] } };

    mode = 'paths';
  } else {
    report = runCheck({ ...scoped, changed: true, base: options.base });
    mode = 'changed';
  }

  let targets = report.meta.files.filter((file) => {
    const kind = fileKind(file);

    return kind === 'script' || kind === 'style';
  });

  if (options.components) {
    const wanted = new Set(options.components.split(',').map((c) => c.trim()));

    const using = new Set(
      (report.inventory.components || [])
        .filter((c) => wanted.has(c.name.split('.')[0]))
        .map((c) => c.file)
    );

    targets = targets.filter((file) => using.has(file));
  }

  const changed = report.meta.changedLines || null;
  const findingsByFile = new Map();

  for (const finding of report.findings) {
    if (!findingsByFile.has(finding.file)) findingsByFile.set(finding.file, []);
    findingsByFile.get(finding.file).push(finding);
  }

  const fileEntries = targets.map((file) => {
    const text = readSource(path.join(root, file)) || '';
    const ranges = changed?.[file];

    return {
      file,
      lines: text ? text.split('\n').length : 0,
      hunks: !ranges || ranges.some(([, end]) => end == null) ? 'all' : ranges,
    };
  });

  const batches = buildBatches(fileEntries, {
    maxFiles: options.maxFiles,
    maxLines: options.maxLines,
    weight: (file) => (findingsByFile.get(file) || []).length,
  });

  const isSetup = (f) =>
    f.category === 'setup' || f.file.endsWith('package.json');

  const setupFindings = report.findings.filter(isSetup);
  const runDir = path.resolve(options.runDir || defaultRunDir(root));
  const exceptions = readExceptions(root);

  const shared = {
    pluginRoot: toPosix(PLUGIN_ROOT),
    root: toPosix(root),
    ds: { version: report.meta.dsVersion, dir: report.meta.dsDir },
    tokens: {
      version: report.meta.tokensVersion,
      dir: report.meta.tokensDir,
      set: report.meta.tokenSet,
    },
    typescript: {
      available: report.meta.typescript,
      version: report.meta.typescriptVersion || null,
      tier: report.meta.tsTier,
    },
    packages: report.meta.packages,
    exceptions,
  };

  fs.mkdirSync(runDir, { recursive: true });

  fs.writeFileSync(
    path.join(runDir, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`
  );

  const written = [];

  const writeBatch = (id, files, candidates) => {
    const fileSet = new Set(files.map((f) => f.file));

    const batch = {
      id,
      ...shared,
      files,
      candidates,
      inventory: (report.inventory.components || []).filter((c) =>
        fileSet.has(c.file)
      ),
    };

    const target = path.join(runDir, `${id}.json`);

    fs.writeFileSync(target, `${JSON.stringify(batch, null, 2)}\n`);

    written.push({
      id,
      file: toPosix(target),
      files: files.map((f) => f.file),
      lines: files.reduce((sum, f) => sum + (f.lines || 0), 0),
      candidates: candidates.length,
    });
  };

  if (setupFindings.length) {
    const setupFiles = [...new Set(setupFindings.map((f) => f.file))].map(
      (file) => ({ file, lines: 0, hunks: 'all' })
    );

    writeBatch('batch-00-setup', setupFiles, setupFindings);
  }

  batches.forEach((batch, index) => {
    const candidates = batch.files.flatMap((f) =>
      (findingsByFile.get(f.file) || []).filter((x) => !isSetup(x))
    );

    writeBatch(
      `batch-${String(index + 1).padStart(2, '0')}`,
      batch.files,
      candidates
    );
  });

  pruneRuns(runDir);

  return {
    runDir: toPosix(runDir),
    mode,
    ...(report.meta.base && {
      base: report.meta.base,
      mergeBase: report.meta.mergeBase,
    }),
    root: toPosix(root),
    ds: shared.ds,
    tokens: shared.tokens,
    typescript: shared.typescript,
    counts: report.meta.counts,
    suppressed: report.meta.suppressed,
    skipped: report.meta.skipped,
    errors: report.meta.errors,
    emptyScope: targets.length === 0 && setupFindings.length === 0,
    exceptions: exceptions.length,
    batches: written,
  };
}

function main() {
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n\n${USAGE}`);
    process.exitCode = 2;

    return;
  }

  if (options.help) {
    process.stdout.write(USAGE);

    return;
  }

  try {
    process.stdout.write(`${JSON.stringify(prepare(options), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`koobiq-review-prep: ${error?.stack || error}\n`);
    process.exitCode = 3;
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
