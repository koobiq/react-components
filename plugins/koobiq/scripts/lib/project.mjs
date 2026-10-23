import path from 'node:path';

import {
  DS_PACKAGE,
  ICONS_PACKAGE,
  INTERNAL_PACKAGES,
  TOKENS_PACKAGE,
  loadKnowledge,
} from '../../lint/koobiq-core.mjs';

import {
  fileExists,
  fileKind,
  lineStarts,
  positionAt,
  readJsonFile,
  readSource,
} from './util.mjs';

const APP_DEPENDENCIES = [
  'next',
  'vite',
  'react-scripts',
  '@remix-run/react',
  '@rsbuild/core',
  '@vitejs/plugin-react',
  '@vitejs/plugin-react-swc',
  'webpack-dev-server',
  'parcel',
  'gatsby',
  '@storybook/react',
];

// src/index.* is not an app marker: libraries use it too (CRA apps are
// recognized by react-scripts).
const APP_FILE_RE =
  /^(?:index\.html|app\/layout\.[jt]sx?|src\/app\/layout\.[jt]sx?|pages\/_app\.[jt]sx?|src\/pages\/_app\.[jt]sx?|src\/main\.[jt]sx?|\.storybook\/preview\.[jt]sx?)$/;

const ENTRY_PRIORITY = [
  /^src\/main\.[jt]sx?$/,
  /^src\/index\.[jt]sx?$/,
  /^(?:src\/)?app\/layout\.[jt]sx?$/,
  /^(?:src\/)?pages\/_app\.[jt]sx?$/,
  /^index\.html$/,
  /^\.storybook\/preview\.[jt]sx?$/,
];

const I18N_LIBRARIES = [
  'i18next',
  'react-i18next',
  'next-i18next',
  'react-intl',
  'next-intl',
  '@lingui/core',
  '@lingui/react',
  'typesafe-i18n',
  '@formatjs/intl',
  'rosetta',
];

const ROUTER_LIBRARIES = [
  'next',
  'react-router',
  'react-router-dom',
  '@tanstack/react-router',
  '@remix-run/react',
];

const TOKEN_IMPORT_RE =
  /@koobiq\/design-tokens\/(web\/(?:new\/)?(?:deprecated\/)?[\w./-]*?\.css)/g;

const STYLE_CSS_RE = /@koobiq\/react-components\/(?:dist\/)?style\.css/g;

const DS_IMPORT_RE =
  /from\s*['"]@koobiq\/react-components(\/markdown|\/code-block)?['"]|import\s*\(\s*['"]@koobiq\/react-components(\/markdown|\/code-block)?['"]/g;

const THEME_CLASS_RE = /\bkbq-(?:light|dark)\b/g;

const INTERNAL_IMPORT_RE =
  /(?:from|import\(|require\()\s*['"](@koobiq\/(?:react-core|react-primitives|logger))['"]/g;

const FONT_RE =
  /@fontsource(?:-variable)?\/(?:inter|jetbrains-mono)|fonts\.googleapis\.com[^'"\s)]*family=Inter|from\s*['"]next\/font\/google['"][\s\S]{0,200}?\bInter\b|\bInter\b[\s\S]{0,40}?from\s*['"]next\/font\/google['"]|@font-face[^}]*Inter/;

const DEFINED_VAR_CSS_RE = /(?<![\w(-])(--kbq-[a-z0-9_-]+)\s*:/g;

const DEFINED_VAR_JS_RE =
  /['"](--kbq-[a-z0-9_-]+)['"]\s*:|setProperty\(\s*['"](--kbq-[a-z0-9_-]+)['"]/g;

const tokenFileInfo = (rel) => {
  const set = /\/new\//.test(rel) ? 'new' : 'legacy';
  const base = rel.split('/').pop();
  let which = 'other';

  if (base === 'css-tokens.css') which = 'base';
  else if (base === 'css-tokens-light.css') which = 'light';
  else if (base === 'css-tokens-dark.css') which = 'dark';
  else if (base === 'css-tokens-font.css') which = 'font';

  return { set, which };
};

const depsOf = (json) => ({
  ...(json?.peerDependencies || {}),
  ...(json?.devDependencies || {}),
  ...(json?.dependencies || {}),
});

/**
 * Groups files into packages (nearest package.json), loads Koobiq knowledge
 * per package and builds the cheap project index the setup checks need.
 */
export function buildProject({ root, files, overrides = {}, config = {} }) {
  const packages = new Map();
  const dirToPackage = new Map();

  const packageFor = (relDir) => {
    if (dirToPackage.has(relDir)) return dirToPackage.get(relDir);

    let current = relDir;
    let found = null;

    for (;;) {
      if (fileExists(path.join(root, current, 'package.json'))) {
        found = current;
        break;
      }

      if (current === '.' || current === '') break;

      const parent = path.posix.dirname(current);

      current = parent === current ? '.' : parent;
    }

    const key = found ?? '.';

    if (!packages.has(key)) {
      const abs = path.join(root, key);
      const json = readJsonFile(path.join(abs, 'package.json'));

      packages.set(key, {
        dir: key,
        abs,
        json,
        name: json?.name || path.basename(abs),
        deps: depsOf(json),
        files: [],
      });
    }

    dirToPackage.set(relDir, packages.get(key));

    return packages.get(key);
  };

  for (const rel of files) {
    const pkg = packageFor(path.posix.dirname(rel) || '.');

    pkg.files.push(rel);
  }

  const rootJson = readJsonFile(path.join(root, 'package.json'));
  const workspaceDeps = depsOf(rootJson);

  for (const pkg of packages.values()) {
    pkg.relFiles = pkg.files.map((rel) =>
      pkg.dir === '.' ? rel : path.posix.relative(pkg.dir, rel)
    );

    pkg.declared = { ...workspaceDeps, ...pkg.deps };
    pkg.knowledge = loadKnowledge(pkg.abs, overrides);

    pkg.framework = pkg.deps.next
      ? 'next'
      : pkg.deps.vite
        ? 'vite'
        : pkg.deps['react-scripts']
          ? 'cra'
          : pkg.deps['@remix-run/react']
            ? 'remix'
            : 'unknown';

    const appPackages = config.setup?.appPackages;

    pkg.isApp = Array.isArray(appPackages)
      ? appPackages.includes(pkg.name) || appPackages.includes(pkg.dir)
      : APP_DEPENDENCIES.some((dep) => pkg.deps[dep]) ||
        pkg.relFiles.some((rel) => APP_FILE_RE.test(rel));

    pkg.hasI18n = I18N_LIBRARIES.some((lib) => pkg.declared[lib]);
    pkg.hasRouter = ROUTER_LIBRARIES.some((lib) => pkg.declared[lib]);

    pkg.entry =
      ENTRY_PRIORITY.map((re) =>
        pkg.files.find((rel, i) => re.test(pkg.relFiles[i]))
      ).find(Boolean) ||
      (pkg.dir === '.' ? 'package.json' : `${pkg.dir}/package.json`);

    pkg.index = indexPackage(root, pkg);

    pkg.usesDs =
      Boolean(pkg.declared[DS_PACKAGE]) || pkg.index.dsImports.length > 0;

    pkg.tokenSet = tokenSetOf(pkg.index.tokenImports);
  }

  return {
    root,
    packages,
    packageFor: (rel) => packageFor(path.posix.dirname(rel) || '.'),
  };
}

const tokenSetOf = (imports) => {
  const sets = new Set(
    imports.filter((i) => i.which !== 'other').map((i) => i.set)
  );

  if (sets.size === 2) return 'mixed';
  if (sets.size === 1) return [...sets][0];

  return 'none';
};

const pushMatches = (list, text, starts, re, map) => {
  for (const match of text.matchAll(re)) {
    const { line } = positionAt(starts, match.index);
    const item = map(match, line);

    if (item) list.push(item);
  }
};

function indexPackage(root, pkg) {
  const index = {
    tokenImports: [],
    styleCssImports: [],
    dsImports: [],
    providerUses: [],
    themeClassUses: [],
    toastUses: [],
    toastProviderUses: [],
    linkHrefUses: 0,
    fonts: false,
    definedVars: new Set(),
    vendoredFiles: new Set(),
    presetFiles: [],
    internalImports: new Set(),
  };

  for (const rel of pkg.files) {
    const kind = fileKind(rel);
    const text = kind === 'package' ? null : readSource(path.join(root, rel));

    if (!text) continue;

    const starts = lineStarts(text);

    pushMatches(
      index.tokenImports,
      text,
      starts,
      TOKEN_IMPORT_RE,
      (m, line) => ({
        file: rel,
        line,
        path: m[1],
        ...tokenFileInfo(m[1]),
      })
    );

    pushMatches(
      index.styleCssImports,
      text,
      starts,
      STYLE_CSS_RE,
      (m, line) => ({ file: rel, line })
    );

    if (FONT_RE.test(text)) index.fonts = true;

    if (kind === 'style') {
      const names = new Set();

      for (const match of text.matchAll(DEFINED_VAR_CSS_RE))
        names.add(match[1]);
      for (const name of names) index.definedVars.add(name);
      if (names.size > 200) index.vendoredFiles.add(rel);
      continue;
    }

    for (const match of text.matchAll(DEFINED_VAR_JS_RE))
      index.definedVars.add(match[1] || match[2]);

    if (kind === 'html') {
      pushMatches(
        index.themeClassUses,
        text,
        starts,
        THEME_CLASS_RE,
        (m, line) => ({ file: rel, line })
      );

      continue;
    }

    for (const match of text.matchAll(INTERNAL_IMPORT_RE)) {
      index.internalImports.add(match[1]);
    }

    pushMatches(index.dsImports, text, starts, DS_IMPORT_RE, (m, line) => ({
      file: rel,
      line,
      entry: m[1] || m[2] || '',
    }));

    if (
      !index.dsImports.some((imp) => imp.file === rel) &&
      !THEME_CLASS_RE.test(text)
    )
      continue;

    THEME_CLASS_RE.lastIndex = 0;

    pushMatches(
      index.themeClassUses,
      text,
      starts,
      THEME_CLASS_RE,
      (m, line) => ({ file: rel, line })
    );

    const dsNamed = [
      ...text.matchAll(
        /import\s*(?:type\s+)?\{([^}]*)\}\s*from\s*['"]@koobiq\/react-components['"]/g
      ),
    ]
      .flatMap((m) =>
        m[1].replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '').split(',')
      )
      .map((s) =>
        s
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)
      )
      .filter(([imported]) => imported);

    const localOf = (name) =>
      dsNamed
        .filter(([imported]) => imported === name)
        .map(([imported, local]) => local || imported);

    for (const local of localOf('Provider')) {
      pushMatches(
        index.providerUses,
        text,
        starts,
        new RegExp(`<${local}\\b([^>]*)>`, 'g'),
        (m, line) => ({
          file: rel,
          line,
          hasRouter: /\brouter\s*=/.test(m[1]),
          hasLocale: /\blocale\s*=/.test(m[1]),
        })
      );
    }

    for (const local of localOf('ToastProvider')) {
      pushMatches(
        index.toastProviderUses,
        text,
        starts,
        new RegExp(`<${local}\\b`, 'g'),
        (m, line) => ({ file: rel, line })
      );
    }

    for (const local of localOf('toast')) {
      pushMatches(
        index.toastUses,
        text,
        starts,
        new RegExp(`\\b${local}\\.\\w+\\(`, 'g'),
        (m, line) => ({ file: rel, line })
      );
    }

    // Only in-app links need the Provider router; external URLs don't.
    for (const local of localOf('Link')) {
      index.linkHrefUses += [
        ...text.matchAll(
          new RegExp(`<${local}\\b[^>]*\\bhref=(?:["']\\/(?!\\/)|\\{)`, 'g')
        ),
      ].length;
    }
  }

  for (const dir of new Set([pkg.dir, '.'])) {
    for (const name of [
      'eslint.koobiq.mjs',
      'stylelint.koobiq.mjs',
      'koobiq-core.mjs',
    ]) {
      const rel = dir === '.' ? `.koobiq/${name}` : `${dir}/.koobiq/${name}`;

      if (fileExists(path.join(root, rel))) index.presetFiles.push(rel);
    }
  }

  return index;
}

export const isInternalDependency = (name) => INTERNAL_PACKAGES.includes(name);

export const PEER_PACKAGES = [TOKENS_PACKAGE, ICONS_PACKAGE];
