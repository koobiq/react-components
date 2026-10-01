import fs from 'node:fs';
import path from 'node:path';

import {
  SKIPPED_DIRS,
  fileExists,
  fileKind,
  git,
  matchesAny,
  toPosix,
} from './util.mjs';

const BASE_CANDIDATES = [
  'origin/HEAD',
  'origin/main',
  'origin/master',
  'main',
  'master',
];

const readGitignore = (root) => {
  try {
    return fs
      .readFileSync(path.join(root, '.gitignore'), 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && !line.startsWith('!'))
      .map((line) => line.replace(/^\//, '').replace(/\/$/, ''));
  } catch {
    return [];
  }
};

/** Fallback file walker for directories that are not git repositories. */
function walk(root) {
  const ignored = readGitignore(root);
  const out = [];
  const stack = [''];

  while (stack.length) {
    const rel = stack.pop();
    let entries;

    try {
      entries = fs.readdirSync(path.join(root, rel), { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;

      if (entry.isSymbolicLink()) continue;
      if (
        ignored.some(
          (pattern) => pattern === entry.name || pattern === childRel
        )
      )
        continue;

      if (entry.isDirectory()) {
        if (!SKIPPED_DIRS.has(entry.name)) stack.push(childRel);
      } else {
        out.push(childRel);
      }
    }
  }

  return out.sort();
}

const isSkippedPath = (rel) =>
  rel
    .split('/')
    .some(
      (segment, index, all) =>
        index < all.length - 1 && SKIPPED_DIRS.has(segment)
    );

const refExists = (ref, root) =>
  git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], root) != null;

/** Parses `git diff -U0` output into { file: [[start, end], ...] }. */
export function parseHunks(diff) {
  const ranges = new Map();
  let current = null;

  for (const line of String(diff || '').split('\n')) {
    if (line.startsWith('+++ ')) {
      const target = line.slice(4).trim();

      current = target === '/dev/null' ? null : target.replace(/^b\//, '');
      if (current && !ranges.has(current)) ranges.set(current, []);
    } else if (current && line.startsWith('@@')) {
      const match = line.match(/\+(\d+)(?:,(\d+))?/);

      if (!match) continue;

      const start = Number(match[1]);
      const count = match[2] == null ? 1 : Number(match[2]);

      if (count > 0) ranges.get(current).push([start, start + count - 1]);
    }
  }

  return ranges;
}

/**
 * Discovers files to analyze. Returns all project files (for the setup
 * index) plus the target set (what findings are reported for).
 */
export function discoverFiles(options) {
  const root = path.resolve(options.root);

  const insideGit =
    git(['rev-parse', '--is-inside-work-tree'], root)?.trim() === 'true';

  const ignore = options.ignore || [];
  let all;

  if (insideGit) {
    const listed = git(
      ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      root
    );

    all = String(listed || '')
      .split('\0')
      .filter(Boolean);
  } else {
    all = walk(root);
  }

  const keep = (rel) =>
    rel &&
    fileKind(rel) &&
    !isSkippedPath(rel) &&
    !matchesAny(rel, ignore) &&
    fileExists(path.join(root, rel));

  all = [...new Set(all.map(toPosix))].filter(keep).sort();

  const result = {
    root,
    insideGit,
    all,
    targets: all,
    mode: 'full',
    base: null,
    mergeBase: null,
    shallow: false,
    changedLines: null,
  };

  if (options.files?.length) {
    const targets = options.files
      .map((file) => toPosix(path.relative(root, path.resolve(root, file))))
      .filter((rel) => !rel.startsWith('..') && keep(rel));

    result.targets = [...new Set(targets)].sort();
    result.mode = 'files';
    for (const rel of result.targets)
      if (!result.all.includes(rel)) result.all.push(rel);

    return result;
  }

  if (!options.changed) return result;

  result.mode = 'changed';

  if (!insideGit) {
    result.error = '--changed needs a git repository';
    result.targets = [];

    return result;
  }

  const base =
    options.base || BASE_CANDIDATES.find((ref) => refExists(ref, root));

  if (!base || !refExists(base, root)) {
    result.error = options.base
      ? `Unknown base ref: ${options.base}`
      : 'No base ref found (pass --base)';

    result.targets = [];

    return result;
  }

  result.base = base;

  let mergeBase = git(['merge-base', base, 'HEAD'], root)?.trim();

  if (!mergeBase) {
    mergeBase = base;
    result.shallow = true;
  }

  result.mergeBase = mergeBase;

  const changed = String(
    git(
      [
        'diff',
        '--name-only',
        '-z',
        '--diff-filter=ACMRT',
        '--relative',
        mergeBase,
      ],
      root
    ) || ''
  )
    .split('\0')
    .filter(Boolean);

  const untracked = String(
    git(['ls-files', '-z', '--others', '--exclude-standard'], root) || ''
  )
    .split('\0')
    .filter(Boolean);

  const hunks = parseHunks(
    git(
      ['diff', '-U0', '--no-color', '--no-ext-diff', '--relative', mergeBase],
      root
    )
  );

  for (const rel of untracked)
    hunks.set(toPosix(rel), [[1, Number.MAX_SAFE_INTEGER]]);

  result.targets = [...new Set([...changed, ...untracked].map(toPosix))]
    .filter(keep)
    .sort();

  result.changedLines = hunks;

  return result;
}

export const inChangedLines = (changedLines, file, line) => {
  if (!changedLines) return undefined;

  const ranges = changedLines.get(file);

  if (!ranges) return false;

  return ranges.some(([start, end]) => line >= start && line <= end);
};
