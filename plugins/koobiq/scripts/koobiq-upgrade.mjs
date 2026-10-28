#!/usr/bin/env node
// Gathers what changes between two versions of @koobiq/react-components for
// the components a product uses: changelog entries, public API report diffs,
// peer dependency changes and lifecycle status. Read-only; network access to
// registry.npmjs.org, raw.githubusercontent.com and react.koobiq.io, with a
// cache for --offline runs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DS_PACKAGE, findPackageDir } from '../lint/koobiq-core.mjs';

import { runCheck } from './lib/engine.mjs';
import { sha1 } from './lib/util.mjs';

const REGISTRY = `https://registry.npmjs.org/${DS_PACKAGE.replace('/', '%2f')}`;
const RAW = 'https://raw.githubusercontent.com/koobiq/react-components';
const LLMS = 'https://react.koobiq.io/llms';
const API_REPORTS_SINCE = [0, 34, 0];

const parse = (version) =>
  String(version)
    .replace(/^v/, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);

export const compareVersions = (a, b) => {
  const x = parse(a);
  const y = parse(b);

  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return (x[i] || 0) - (y[i] || 0);
  }

  return 0;
};

/** Fetch with a file cache; `offline` reads the cache only. */
export function createFetcher({ cacheDir, offline = false }) {
  const cacheFile = (url) =>
    cacheDir ? path.join(cacheDir, `${sha1(url).slice(0, 20)}.txt`) : null;

  return async (url, { json = false, headers } = {}) => {
    const file = cacheFile(url);

    if (file && fs.existsSync(file)) {
      const text = fs.readFileSync(file, 'utf8');

      return json ? JSON.parse(text) : text;
    }

    if (offline) return null;

    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) return null;

      const text = await response.text();

      if (file) {
        fs.mkdirSync(cacheDir, { recursive: true });
        fs.writeFileSync(file, text);
      }

      return json ? JSON.parse(text) : text;
    } catch {
      return null;
    }
  };
}

/** Parses the commit-and-tag-version CHANGELOG into versions and entries. */
export function parseChangelog(text) {
  const versions = [];
  let current = null;
  let section = null;

  for (const line of String(text || '').split(/\r?\n/)) {
    const heading = line.match(
      /^##\s+\[?(\d+\.\d+\.\d+)\]?(?:\([^)]*\))?\s*(?:\((\d{4}-\d{2}-\d{2})\))?/
    );

    if (heading) {
      current = { version: heading[1], date: heading[2] || null, entries: [] };
      versions.push(current);
      section = null;
      continue;
    }

    const sub = line.match(/^###\s+(.*)$/);

    if (sub && current) {
      section = /BREAKING/i.test(sub[1])
        ? 'breaking'
        : /fix/i.test(sub[1])
          ? 'fix'
          : /feat/i.test(sub[1])
            ? 'feat'
            : 'other';

      continue;
    }

    const entry = line.match(/^\*\s+(?:\*\*([^*]+):\*\*\s+)?(.*)$/);

    if (entry && current && section) {
      const scopes = (entry[1] || '').split(/\s*,\s*/).filter(Boolean);

      const textOnly = entry[2]
        .replace(/\s*\(\[[0-9a-f]{7,}\]\([^)]*\)\)/g, '')
        .replace(/\s*\(\[#\d+\]\([^)]*\)\)/g, '')
        .replace(/,\s*closes\s.*$/, '')
        .trim();

      current.entries.push({
        type: section,
        scopes,
        text: textOnly,
        breaking: section === 'breaking' || /!$/.test(entry[1] || ''),
      });
    }
  }

  return versions;
}

const extractApi = (markdown) => {
  const block = String(markdown || '').match(/```ts\r?\n([\s\S]*?)```/);

  return block
    ? block[1]
        .split(/\r?\n/)
        .map((l) => l.trimEnd())
        .filter((l) => l.trim() && !l.trim().startsWith('//'))
    : [];
};

/** Line-level diff of two API reports (order-insensitive). */
export function diffApi(before, after) {
  const a = new Set(extractApi(before));
  const b = new Set(extractApi(after));

  return {
    removed: [...a].filter((line) => !b.has(line)),
    added: [...b].filter((line) => !a.has(line)),
  };
}

const usedComponents = (root, options) => {
  try {
    const report = runCheck({
      root,
      inventory: 'summary',
      typescript: options.typescript,
      dsDir: options.dsDir,
    });

    return Object.keys(report.inventory?.summary?.components || {}).map(
      (name) => name.split('.')[0]
    );
  } catch {
    return [];
  }
};

export async function gatherUpgrade(options) {
  const root = path.resolve(options.root || process.cwd());

  const fetchText = createFetcher({
    cacheDir: options.cacheDir,
    offline: options.offline,
  });

  const dsDir = options.dsDir || findPackageDir(root, DS_PACKAGE);

  const installed = dsDir
    ? JSON.parse(fs.readFileSync(path.join(dsDir, 'package.json'), 'utf8'))
        .version
    : null;

  const from = options.from || installed;

  const registry = await fetchText(REGISTRY, {
    json: true,
    headers: { accept: 'application/vnd.npm.install-v1+json' },
  });

  const latest = registry?.['dist-tags']?.latest || null;
  const to = !options.to || options.to === 'latest' ? latest : options.to;

  const result = {
    from,
    to,
    latest,
    installed,
    offline: Boolean(options.offline),
    errors: [],
  };

  if (!from || !to) {
    result.errors.push(
      !from
        ? 'Installed version unknown: pass --from.'
        : 'Target version unknown (offline without cache?): pass --to.'
    );

    return result;
  }

  if (compareVersions(to, from) <= 0) {
    result.errors.push(`Target ${to} is not newer than ${from}.`);

    return result;
  }

  const components = [
    ...new Set(
      options.components?.length
        ? options.components
        : usedComponents(root, options)
    ),
  ].sort();

  result.components = components;

  result.versions = registry
    ? Object.keys(registry.versions || {})
        .filter(
          (v) => compareVersions(v, from) > 0 && compareVersions(v, to) <= 0
        )
        .sort(compareVersions)
    : null;

  const peers = (version) =>
    registry?.versions?.[version]?.peerDependencies || null;

  const peerFrom = peers(from);
  const peerTo = peers(to);

  if (peerTo) {
    result.peerDependencies = {
      to: peerTo,
      changed: Object.keys(peerTo)
        .filter((name) => peerFrom?.[name] !== peerTo[name])
        .map((name) => ({
          name,
          from: peerFrom?.[name] ?? null,
          to: peerTo[name],
        })),
    };
  }

  const changelog = parseChangelog(
    await fetchText(`${RAW}/${to}/CHANGELOG.md`)
  );

  const relevant = new Set(components.map((c) => c.toLowerCase()));

  result.changelog = changelog
    .filter(
      (v) =>
        compareVersions(v.version, from) > 0 &&
        compareVersions(v.version, to) <= 0
    )
    .map((v) => ({
      ...v,
      entries: v.entries.map((e) => ({
        ...e,
        relevant:
          e.scopes.some((s) => relevant.has(s.toLowerCase())) || e.breaking,
      })),
    }));

  if (!changelog.length)
    result.errors.push(`CHANGELOG.md at ${to} is unavailable.`);

  const reportsAvailable =
    compareVersions(from, API_REPORTS_SINCE.join('.')) >= 0;

  result.apiDiffs = {};

  if (!reportsAvailable) {
    result.errors.push(
      `Public API reports exist from ${API_REPORTS_SINCE.join('.')}; rely on the changelog and the type-check after the bump.`
    );
  } else {
    for (const name of components) {
      const [before, after] = await Promise.all([
        fetchText(
          `${RAW}/${from}/tools/public_api_guard/components/${name}.api.md`
        ),
        fetchText(
          `${RAW}/${to}/tools/public_api_guard/components/${name}.api.md`
        ),
      ]);

      if (before == null && after == null) continue;

      const diff =
        before == null
          ? { removed: [], added: ['(new report)'] }
          : after == null
            ? { removed: ['(report removed)'], added: [] }
            : diffApi(before, after);

      if (diff.removed.length || diff.added.length)
        result.apiDiffs[name] = diff;
    }
  }

  result.status = {};

  if (!options.offline || options.cacheDir) {
    for (const name of components) {
      const text = await fetchText(
        `${LLMS}/components-${name.toLowerCase()}.txt`
      );

      const status = text?.match(/<Status variant="(\w+)"/)?.[1];

      if (status) result.status[name] = status;
    }
  }

  return result;
}

async function main() {
  const args = process.argv.slice(2);

  const value = (name) => {
    const index = args.indexOf(`--${name}`);

    return index === -1 ? undefined : args[index + 1];
  };

  if (args.includes('--help')) {
    process.stdout.write(
      'Usage: node koobiq-upgrade.mjs [--root <dir>] [--from <version>] [--to <version|latest>] [--components A,B] [--cache-dir <dir>] [--offline]\n'
    );

    return;
  }

  try {
    const result = await gatherUpgrade({
      root: value('root'),
      from: value('from'),
      to: value('to'),
      components: value('components')
        ?.split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      cacheDir: value('cache-dir'),
      offline: args.includes('--offline'),
      typescript: value('typescript'),
      dsDir: value('ds-dir'),
    });

    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`koobiq-upgrade: ${error?.stack || error}\n`);
    process.exitCode = 3;
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
