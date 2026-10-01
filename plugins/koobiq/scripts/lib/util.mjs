import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const SCRIPT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
]);

export const STYLE_EXTENSIONS = new Set([
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.pcss',
]);

export const MAX_FILE_BYTES = 1.5 * 1024 * 1024;

export const SKIPPED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  '.output',
  '.turbo',
  '.cache',
  '.vercel',
  'coverage',
  'storybook-static',
  '.yarn',
  'vendor',
  '.koobiq',
]);

/** 'script' | 'style' | 'html' | 'package' | null */
export function fileKind(file) {
  const base = path.basename(file);

  if (base === 'package.json') return 'package';
  if (base.endsWith('.d.ts') || /\.min\.[a-z]+$/.test(base)) return null;

  const ext = path.extname(base).toLowerCase();

  if (SCRIPT_EXTENSIONS.has(ext)) return 'script';
  if (STYLE_EXTENSIONS.has(ext)) return 'style';
  if (ext === '.html') return 'html';

  return null;
}

export const toPosix = (file) => file.split(path.sep).join('/');

/** Reads a source file; strips a BOM; returns null for unreadable or huge files. */
export function readSource(file) {
  try {
    const stat = fs.statSync(file);

    if (!stat.isFile() || stat.size > MAX_FILE_BYTES) return null;

    const text = fs.readFileSync(file, 'utf8');

    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  } catch {
    return null;
  }
}

/** Minified or generated text: very long average line length. */
export function looksMinified(text) {
  const lines = text.split('\n').length;

  return text.length > 5000 && text.length / lines > 1000;
}

export function lineStarts(text) {
  const starts = [0];

  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 10) starts.push(i + 1);
  }

  return starts;
}

/** 1-based line and column of a character offset. */
export function positionAt(starts, offset) {
  let low = 0;
  let high = starts.length - 1;

  while (low < high) {
    const mid = (low + high + 1) >> 1;

    if (starts[mid] <= offset) low = mid;
    else high = mid - 1;
  }

  return { line: low + 1, column: offset - starts[low] + 1 };
}

export function lineAt(text, starts, line) {
  const start = starts[line - 1];

  if (start == null) return '';

  const end = starts[line] != null ? starts[line] - 1 : text.length;

  return text.slice(start, end).replace(/\r$/, '');
}

export const sha1 = (value) =>
  crypto.createHash('sha1').update(value).digest('hex');

export const sha256 = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

/** Runs git without a shell; returns stdout or null on failure. */
export function git(args, cwd) {
  try {
    return execFileSync('git', ['-c', 'core.quotepath=off', ...args], {
      cwd,
      encoding: 'utf8',
      windowsHide: true,
      timeout: 20000,
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

const TEST_DIR_RE =
  /(?:^|\/)(?:__tests__|__mocks__|__fixtures__|tests?|e2e|cypress|playwright|stories|\.storybook)\//;

const TEST_FILE_RE =
  /\.(?:test|spec|stories|story|e2e|cy|fixture)\.[cm]?[jt]sx?$/;

export const isTestFile = (rel) =>
  TEST_DIR_RE.test(rel) || TEST_FILE_RE.test(rel);

/** Minimal glob → RegExp (supports **, *, ?, {a,b}). */
export function globToRegExp(glob) {
  let re = '';
  let i = 0;

  while (i < glob.length) {
    const char = glob[i];

    if (char === '*') {
      if (glob[i + 1] === '*') {
        re += glob[i + 2] === '/' ? '(?:.*/)?' : '.*';
        i += glob[i + 2] === '/' ? 3 : 2;
        continue;
      }

      re += '[^/]*';
    } else if (char === '?') {
      re += '[^/]';
    } else if (char === '{') {
      const end = glob.indexOf('}', i);

      if (end !== -1) {
        const parts = glob.slice(i + 1, end).split(',');

        re += `(?:${parts.map((p) => p.replace(/[.+^$()|[\]\\]/g, '\\$&')).join('|')})`;
        i = end + 1;
        continue;
      }

      re += '\\{';
    } else {
      re += char.replace(/[.+^$()|[\]\\]/g, '\\$&');
    }

    i += 1;
  }

  return new RegExp(`^${re}$`);
}

export function matchesAny(rel, globs = []) {
  return globs.some((glob) => {
    const re = globToRegExp(glob);

    return (
      re.test(rel) || (!glob.includes('/') && re.test(path.posix.basename(rel)))
    );
  });
}

export const readJsonFile = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

export const fileExists = (file) => {
  try {
    fs.accessSync(file);

    return true;
  } catch {
    return false;
  }
};

export const truncate = (value, max = 200) => {
  const text = String(value ?? '').trim();

  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
