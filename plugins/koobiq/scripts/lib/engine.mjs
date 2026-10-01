import path from 'node:path';

import { RULES, PRESET_VERSION } from '../../lint/koobiq-core.mjs';

import { checkScriptFile } from './checks/script.mjs';
import { checkPackageSetup } from './checks/setup.mjs';
import { checkStyleFacts } from './checks/style.mjs';
import { discoverFiles } from './discover.mjs';
import { parseScript } from './parse-script.mjs';
import { parseStyle, styleSyntaxFor } from './parse-style.mjs';
import { buildProject } from './project.mjs';
import { finalizeFindings } from './report.mjs';
import { loadTypeScript } from './ts.mjs';
import {
  fileKind,
  isTestFile,
  lineStarts,
  looksMinified,
  positionAt,
  readJsonFile,
  readSource,
} from './util.mjs';

export const TOOL_NAME = 'koobiq-check';
export const TOOL_VERSION = '0.1.0';

const loadConfig = (root, explicit) => {
  const file = explicit
    ? path.resolve(root, explicit)
    : path.join(root, '.koobiq', 'check.json');

  const config = readJsonFile(file);

  return { config: config || {}, configFile: config ? file : null };
};

/**
 * Runs every deterministic check and returns the JSON report object.
 * Never throws for per-file problems: they land in meta.skipped/errors.
 */
export function runCheck(options) {
  const started = Date.now();
  const timings = {};

  const mark = (name, since) => {
    timings[name] = Date.now() - since;
  };

  const root = path.resolve(options.root || process.cwd());
  const { config, configFile } = loadConfig(root, options.config);
  const skipped = [];
  const errors = [];

  let t = Date.now();

  const discovery = discoverFiles({
    ...options,
    root,
    ignore: config.ignore || [],
  });

  mark('discover', t);

  if (discovery.error)
    errors.push({ stage: 'discover', message: discovery.error });

  t = Date.now();

  const project = buildProject({
    root,
    files: discovery.all,
    overrides: {
      dsDir: options.dsDir,
      tokensDir: options.tokensDir,
      iconsDir: options.iconsDir,
    },
    config,
  });

  mark('knowledge', t);

  const packageDirs = [...project.packages.values()].map((pkg) => pkg.abs);

  const ts = loadTypeScript(root, {
    explicit: options.typescript,
    extraDirs: packageDirs,
  });

  if (!ts)
    skipped.push({
      check: 'typescript-parser',
      reason: 'typescript not found; using the regex tier',
    });
  if (options.typecheck)
    skipped.push({
      check: 'typecheck',
      reason: 'language-service pass not available in this version',
    });
  else skipped.push({ check: 'typecheck', reason: 'off (pass --typecheck)' });

  t = Date.now();

  const raw = [];
  const sources = new Map();
  const inventory = { components: [], imports: [] };
  const touchedPackages = new Set();
  let filesScanned = 0;
  let filesSkipped = 0;

  for (const rel of discovery.targets) {
    const kind = fileKind(rel);
    const pkg = project.packageFor(rel);

    touchedPackages.add(pkg);

    if (kind !== 'script' && kind !== 'style') continue;

    const text = readSource(path.join(root, rel));

    if (text == null || looksMinified(text)) {
      filesSkipped += 1;
      continue;
    }

    filesScanned += 1;

    const starts = lineStarts(text);

    sources.set(rel, { text, starts });

    const ctx = {
      knowledge: pkg.knowledge,
      tokenSet: pkg.tokenSet,
      productDefined: pkg.index.definedVars,
      config,
      rules: config.rules || {},
      usesDs: pkg.usesDs,
      hasI18n: pkg.hasI18n,
      isTest: isTestFile(rel),
      vendored: pkg.index.vendoredFiles.has(rel),
    };

    try {
      if (kind === 'script') {
        const facts = parseScript(text, rel, ts);
        const result = checkScriptFile(facts, ctx);

        for (const found of result.findings)
          raw.push({
            ...found,
            file: rel,
            source: facts.tier === 'regex' ? 'regex' : found.source,
          });

        for (const component of result.components) {
          const entry = {
            ...component,
            file: rel,
            ...positionAt(starts, component.offset),
          };

          delete entry.offset;
          inventory.components.push(entry);
        }

        for (const imp of result.imports) {
          const entry = {
            ...imp,
            file: rel,
            line: positionAt(starts, imp.offset).line,
          };

          delete entry.offset;
          inventory.imports.push(entry);
        }
      } else {
        const facts = parseStyle(text, { syntax: styleSyntaxFor(rel) });

        for (const found of checkStyleFacts(facts, ctx))
          raw.push({ ...found, file: rel, source: 'css' });
      }
    } catch (error) {
      errors.push({
        file: rel,
        message: String(error?.stack || error)
          .split('\n')
          .slice(0, 3)
          .join(' '),
      });
    }
  }

  mark('analyze', t);
  t = Date.now();

  const setupPackages =
    discovery.mode === 'full'
      ? [...project.packages.values()]
      : [...touchedPackages];

  for (const pkg of setupPackages) {
    try {
      for (const found of checkPackageSetup(pkg, { root, config })) {
        if (!sources.has(found.file)) {
          const text = readSource(path.join(root, found.file));

          if (text != null)
            sources.set(found.file, { text, starts: lineStarts(text) });
        }

        raw.push({ ...found, source: 'project' });
      }
    } catch (error) {
      errors.push({
        package: pkg.dir,
        message: String(error?.message || error),
      });
    }

    if (!pkg.knowledge?.ds && pkg.usesDs) {
      skipped.push({
        check: 'knowledge',
        reason: `${pkg.dir}: @koobiq/react-components is not installed (run the package install)`,
      });
    }
  }

  mark('setup', t);
  t = Date.now();

  const report = finalizeFindings(raw, {
    sources,
    changedLines: discovery.changedLines,
    config,
    only: options.only,
    maxPerFile: options.maxPerFile,
    maxFindings: options.maxFindings,
  });

  mark('report', t);

  const inventoryMode =
    options.inventory || (discovery.mode === 'full' ? 'summary' : 'full');

  const summary = {};

  for (const component of inventory.components)
    summary[component.name] = (summary[component.name] || 0) + 1;

  const primary =
    [...project.packages.values()].find((pkg) => pkg.knowledge?.ds) ||
    [...project.packages.values()][0];

  const packages = [...project.packages.values()].map((pkg) => ({
    dir: pkg.dir,
    name: pkg.name,
    app: pkg.isApp,
    usesDs: pkg.usesDs,
    framework: pkg.framework,
    dsVersion: pkg.knowledge?.ds?.version || null,
    dsDeclared: pkg.declared['@koobiq/react-components'] || null,
    tokensVersion: pkg.knowledge?.tokens?.version || null,
    tokenSet: pkg.tokenSet,
    entry: pkg.entry,
  }));

  return {
    schemaVersion: 1,
    tool: {
      name: TOOL_NAME,
      version: TOOL_VERSION,
      presetVersion: PRESET_VERSION,
    },
    meta: {
      root: root.split(path.sep).join('/'),
      mode: discovery.mode,
      ...(discovery.base && {
        base: discovery.base,
        mergeBase: discovery.mergeBase,
      }),
      ...(discovery.shallow && { shallow: true }),
      ...(discovery.changedLines && {
        changedLines: Object.fromEntries(
          [...discovery.changedLines]
            .filter(([file]) => discovery.targets.includes(file))
            .map(([file, ranges]) => [
              file,
              ranges.map(([start, end]) => [
                start,
                end === Number.MAX_SAFE_INTEGER ? null : end,
              ]),
            ])
        ),
      }),
      dsVersion: primary?.knowledge?.ds?.version || null,
      dsDir: primary?.knowledge?.ds?.dir?.split(path.sep).join('/') || null,
      tokensVersion: primary?.knowledge?.tokens?.version || null,
      tokensDir:
        primary?.knowledge?.tokens?.dir?.split(path.sep).join('/') || null,
      tokenSet: primary?.tokenSet || 'none',
      typescript: Boolean(ts),
      ...(ts && { typescriptVersion: ts.version }),
      tsTier: ts ? 'parser' : 'none',
      packages,
      files: discovery.targets,
      filesScanned,
      filesIndexed: discovery.all.length,
      filesSkipped,
      configFile,
      durationMs: Date.now() - started,
      timings,
      counts: report.counts,
      suppressed: report.suppressed,
      skipped,
      truncated: report.truncated,
      errors,
      rules: Object.keys(RULES).length,
    },
    findings: report.findings,
    inventory:
      inventoryMode === 'none'
        ? { mode: 'none' }
        : {
            mode: inventoryMode,
            ...(inventoryMode === 'full' && {
              components: inventory.components,
              imports: inventory.imports,
            }),
            summary: {
              components: summary,
              files: new Set(inventory.components.map((c) => c.file)).size,
            },
          },
  };
}
