// T2: follows local barrel files (`src/ui/index.ts` re-exporting Koobiq
// components) so `import { Button } from '@/ui'` still resolves to the DS.
import fs from 'node:fs';
import path from 'node:path';

import { DS_PACKAGE } from '../../lint/koobiq-core.mjs';

import { maskComments } from './parse-style.mjs';

const DS_ENTRIES = new Set([
  DS_PACKAGE,
  `${DS_PACKAGE}/markdown`,
  `${DS_PACKAGE}/code-block`,
]);

const EXTENSIONS = ['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs', '.cjs'];
const MAX_DEPTH = 3;

const isFile = (file) => {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
};

const findTsconfig = (fromDir, root) => {
  let dir = fromDir;

  for (;;) {
    const candidate = path.join(dir, 'tsconfig.json');

    if (isFile(candidate)) return candidate;
    if (path.resolve(dir) === path.resolve(root)) return null;

    const parent = path.dirname(dir);

    if (parent === dir) return null;
    dir = parent;
  }
};

/**
 * Creates a resolver for one project. Uses TypeScript module resolution
 * (tsconfig paths, baseUrl) when available, plain relative resolution
 * otherwise. Only files outside node_modules count as barrels.
 */
export function createBarrelResolver({ root, ts }) {
  const optionsCache = new Map();
  const exportsCache = new Map();

  const compilerOptions = (file) => {
    if (!ts) return null;

    const config = findTsconfig(path.dirname(file), root);

    if (!config) return {};
    if (optionsCache.has(config)) return optionsCache.get(config);

    let options = {};

    try {
      const read = ts.readConfigFile(config, ts.sys.readFile);

      const parsed = ts.parseJsonConfigFileContent(
        read.config || {},
        ts.sys,
        path.dirname(config)
      );

      options = parsed.options;
    } catch {
      options = {};
    }

    optionsCache.set(config, options);

    return options;
  };

  const resolve = (fromFile, source) => {
    if (source.startsWith('.')) {
      const base = path.resolve(path.dirname(fromFile), source);

      const candidates = [
        base,
        ...EXTENSIONS.map((ext) => `${base}${ext}`),
        ...EXTENSIONS.map((ext) => path.join(base, `index${ext}`)),
      ];

      return candidates.find(isFile) || null;
    }

    if (!ts || source.startsWith('@koobiq/')) return null;

    try {
      const resolved = ts.resolveModuleName(
        source,
        fromFile,
        compilerOptions(fromFile) || {},
        ts.sys
      ).resolvedModule;

      const file = resolved?.resolvedFileName;

      if (
        !file ||
        /[\\/]node_modules[\\/]/.test(file) ||
        file.endsWith('.d.ts')
      )
        return null;

      return file;
    } catch {
      return null;
    }
  };

  /** Map exported name → { name, source } for Koobiq re-exports of a file. */
  const barrelExports = (file, depth = 0, seen = new Set()) => {
    if (exportsCache.has(file)) return exportsCache.get(file);
    if (depth > MAX_DEPTH || seen.has(file)) return new Map();
    seen.add(file);

    const map = new Map();
    let text = '';

    try {
      text = maskComments(fs.readFileSync(file, 'utf8'), {
        lineComments: true,
      });
    } catch {
      return map;
    }

    for (const match of text.matchAll(
      /export\s+(type\s+)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g
    )) {
      if (match[1]) continue;

      const source = match[3];
      const nested = DS_ENTRIES.has(source) ? null : resolve(file, source);
      const nestedMap = nested ? barrelExports(nested, depth + 1, seen) : null;

      for (const part of match[2].split(',')) {
        const clean = part.trim();

        if (!clean || clean.startsWith('type ')) continue;

        const [imported, exported] = clean
          .split(/\s+as\s+/)
          .map((s) => s.trim());

        if (DS_ENTRIES.has(source))
          map.set(exported || imported, { name: imported, source });
        else if (nestedMap?.has(imported))
          map.set(exported || imported, nestedMap.get(imported));
      }
    }

    for (const match of text.matchAll(
      /export\s*\*\s*from\s*['"]([^'"]+)['"]/g
    )) {
      const source = match[1];

      if (DS_ENTRIES.has(source)) {
        map.set('*', { source });
      } else {
        const nested = resolve(file, source);

        if (nested) {
          for (const [name, target] of barrelExports(nested, depth + 1, seen)) {
            if (!map.has(name)) map.set(name, target);
          }
        }
      }
    }

    exportsCache.set(file, map);

    return map;
  };

  /** Resolves `import { name } from source` in `fromFile` to a Koobiq export. */
  return (fromFile, source, importedName) => {
    if (DS_ENTRIES.has(source) || source.startsWith('@koobiq/')) return null;

    const file = resolve(fromFile, source);

    if (!file) return null;

    const map = barrelExports(file);
    const direct = map.get(importedName);

    if (direct) return { ...direct, via: file };

    const star = map.get('*');

    return star
      ? { name: importedName, source: star.source, via: file, wildcard: true }
      : null;
  };
}
