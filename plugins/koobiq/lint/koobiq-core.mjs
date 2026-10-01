// Koobiq design-system knowledge and decisions shared by koobiq-check,
// the ESLint preset and the Stylelint preset. Self-contained on purpose:
// /koobiq:setup-lint copies this file into product repositories.
import fs from 'node:fs';
import path from 'node:path';

export const PRESET_VERSION = '1';

export const DOCS_BASE = 'https://react.koobiq.io/?path=/docs/';

export const DS_PACKAGE = '@koobiq/react-components';
export const TOKENS_PACKAGE = '@koobiq/design-tokens';
export const ICONS_PACKAGE = '@koobiq/react-icons';
export const INTERNAL_PACKAGES = [
  '@koobiq/react-core',
  '@koobiq/react-primitives',
  '@koobiq/logger',
];

// Exports of the internal packages that the docs present to consumers.
export const DOCUMENTED_INTERNAL_EXPORTS = {
  '@koobiq/react-core': [
    'useBoolean',
    'useCopyToClipboard',
    'useDebounceCallback',
    'useElementOverflow',
    'useElementSize',
    'useEventListener',
    'useHideOverflowItems',
    'useInterval',
    'useMediaQuery',
    'useRefs',
    'useResizeObserver',
    'FileSizeFormatter',
  ],
  '@koobiq/react-primitives': ['Button', 'Link'],
};

export const docsUrl = (id) => `${DOCS_BASE}${id}`;

const DOCS_ID_EXCEPTIONS = {
  SideNavbar: 'components-navbar-sidenavbar--docs',
  TopNavbar: 'components-navbar-topnavbar--docs',
};

export const componentDocsId = (name) => {
  const root = String(name).split('.')[0];

  return DOCS_ID_EXCEPTIONS[root] || `components-${root.toLowerCase()}--docs`;
};

// detector: 'script' — koobiq-check and the lint presets find it;
// 'agent' — only the reviewer agent can judge it; 'both' — the script
// finds candidates and the agent verifies or extends them.
const rule = (category, severity, detector, docs, summary, extra = {}) => ({
  category,
  severity,
  detector,
  docs,
  summary,
  ...extra,
});

export const RULES = {
  // setup
  'setup/legacy-token-set': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'Design tokens come from the legacy web/css-tokens*.css set instead of web/new.'
  ),
  'setup/mixed-token-sets': rule(
    'setup',
    'error',
    'script',
    'welcome--docs',
    'Both the legacy and the web/new token sets are imported.'
  ),
  'setup/missing-tokens': rule(
    'setup',
    'error',
    'script',
    'welcome--docs',
    'The app uses Koobiq components but never imports the design-token stylesheets.'
  ),
  'setup/style-css-order': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'Component styles are imported before the design tokens.'
  ),
  'setup/missing-style-css': rule(
    'setup',
    'error',
    'script',
    'welcome--docs',
    '@koobiq/react-components/style.css is never imported.'
  ),
  'setup/no-provider': rule(
    'setup',
    'warning',
    'both',
    'welcome--docs',
    'The app never renders the Koobiq <Provider>.'
  ),
  'setup/no-theme-class': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'No element gets the kbq-light / kbq-dark theme class.'
  ),
  'setup/theme-class-scope': rule(
    'setup',
    'warning',
    'agent',
    'welcome--docs',
    'The theme class sits on a wrapper element, so portaled overlays lose the theme.'
  ),
  'setup/missing-peer-dependency': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'A peer dependency of @koobiq/react-components is not declared.'
  ),
  'setup/missing-optional-peer': rule(
    'setup',
    'error',
    'script',
    'welcome--docs',
    'An entry point is used without its optional peer dependencies.'
  ),
  'setup/ds-version-skew': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'The app pins an internal Koobiq package to a version the DS does not use.'
  ),
  'setup/duplicate-ds-packages': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'Several versions of a Koobiq package are installed.'
  ),
  'setup/no-toast-provider': rule(
    'setup',
    'warning',
    'script',
    'components-toastprovider--docs',
    'toast is used but <ToastProvider> is never rendered.'
  ),
  'setup/provider-without-router': rule(
    'setup',
    'info',
    'both',
    'welcome--docs',
    'A client-side router is used but <Provider> gets no router.'
  ),
  'setup/ssr-breakpoints-fallback': rule(
    'setup',
    'info',
    'agent',
    'responsive-ui--docs',
    'Responsive values in an SSR app need Provider breakpointsFallback.'
  ),
  'setup/missing-fonts': rule(
    'setup',
    'info',
    'script',
    'fonts--docs',
    'Inter / JetBrains Mono are not loaded.'
  ),
  'setup/vendored-tokens': rule(
    'setup',
    'warning',
    'script',
    'welcome--docs',
    'A product file redefines hundreds of design tokens instead of importing the package.'
  ),
  'setup/lint-preset-outdated': rule(
    'setup',
    'info',
    'script',
    'ai-claude-code-plugin--docs',
    'The copied Koobiq lint preset is older than the plugin.'
  ),
  'setup/lint-preset-modified': rule(
    'setup',
    'info',
    'script',
    'ai-claude-code-plugin--docs',
    'The copied Koobiq lint preset was edited locally.'
  ),
  // import
  'import/deep': rule(
    'import',
    'error',
    'script',
    'welcome--docs',
    'Import from a non-public path of a Koobiq package.'
  ),
  'import/unknown-export': rule(
    'import',
    'error',
    'script',
    'welcome--docs',
    'The imported name is not exported by this Koobiq entry point.'
  ),
  'import/internal-layer': rule(
    'import',
    'warning',
    'script',
    'welcome--docs',
    'Import of an undocumented export of an internal Koobiq layer (react-core, react-primitives, logger).'
  ),
  'import/direct-core-dependency': rule(
    'import',
    'warning',
    'script',
    'welcome--docs',
    'The app declares an internal Koobiq package it never imports.'
  ),
  'import/react-aria-direct': rule(
    'import',
    'info',
    'script',
    'welcome--docs',
    'React Aria is used directly next to the DS that wraps it.'
  ),
  'import/other-ui-kit': rule(
    'import',
    'warning',
    'script',
    'welcome--docs',
    'Another UI kit is used for something Koobiq provides.'
  ),
  'import/other-icons': rule(
    'import',
    'warning',
    'script',
    'icons--docs',
    'Another icon library is used instead of @koobiq/react-icons.'
  ),
  // deprecated
  'deprecated/prop': rule(
    'deprecated',
    'warning',
    'both',
    'deprecation-strategy--docs',
    'A deprecated prop of a Koobiq component is used.'
  ),
  'deprecated/component': rule(
    'deprecated',
    'warning',
    'both',
    'deprecation-strategy--docs',
    'A deprecated Koobiq component is used.'
  ),
  'deprecated/export': rule(
    'deprecated',
    'warning',
    'both',
    'deprecation-strategy--docs',
    'A deprecated Koobiq export is used.'
  ),
  // token
  'token/unknown': rule(
    'token',
    'error',
    'script',
    'welcome--docs',
    'The --kbq-* variable does not exist in the installed design tokens or the DS.'
  ),
  'token/deprecated': rule(
    'token',
    'warning',
    'script',
    'welcome--docs',
    'The design token is deprecated.'
  ),
  'token/legacy-only': rule(
    'token',
    'warning',
    'script',
    'welcome--docs',
    'The token exists only in the legacy token set.'
  ),
  'token/defines-unknown-public-var': rule(
    'token',
    'warning',
    'script',
    'welcome--docs',
    'The product defines a --kbq-* variable that is neither a token nor a component override point.'
  ),
  'token/overrides-token': rule(
    'token',
    'info',
    'script',
    'welcome--docs',
    'The product redefines a design token.'
  ),
  'token/scss-static-variable': rule(
    'token',
    'warning',
    'script',
    'welcome--docs',
    'A static SCSS token variable is used; it never switches themes.'
  ),
  'token/raw-palette': rule(
    'token',
    'warning',
    'agent',
    'welcome--docs',
    'Raw palette tokens (plt-*, semantic-*) are used for UI; they do not switch themes.'
  ),
  'token/raw-size': rule(
    'token',
    'info',
    'agent',
    'welcome--docs',
    'A spacing or radius value equals a --kbq-size-* token.'
  ),
  'token/raw-typography': rule(
    'token',
    'warning',
    'agent',
    'components-typography--docs',
    'Font properties are hand-written instead of Typography or typography tokens.'
  ),
  // style
  'style/hashed-class': rule(
    'style',
    'error',
    'script',
    'welcome--docs',
    'A selector targets a hashed Koobiq CSS-module class, which is not public API.'
  ),
  'style/ds-global-class': rule(
    'style',
    'info',
    'script',
    'welcome--docs',
    'A selector targets an internal global Koobiq class.'
  ),
  'style/important-on-ds': rule(
    'style',
    'warning',
    'script',
    'welcome--docs',
    '!important is used to override Koobiq component styles.'
  ),
  'style/hardcoded-color': rule(
    'style',
    'warning',
    'both',
    'welcome--docs',
    'A literal color is used where a theme-aware token exists.'
  ),
  'style/hardcoded-z-index': rule(
    'style',
    'info',
    'script',
    'welcome--docs',
    'A literal z-index competes with the --kbq-layer-* scale.'
  ),
  'style/hardcoded-spacing': rule(
    'style',
    'info',
    'script',
    'welcome--docs',
    'A px value equals a --kbq-size-* token.',
    { defaultEnabled: false }
  ),
  'style/dom-structure': rule(
    'style',
    'warning',
    'agent',
    'welcome--docs',
    'A selector depends on the internal DOM of a Koobiq component.'
  ),
  'style/private-var': rule(
    'style',
    'info',
    'agent',
    'welcome--docs',
    'A private --<component>-* variable of a Koobiq component is overridden.'
  ),
  // component
  'component/raw-element': rule(
    'component',
    'warning',
    'both',
    'welcome--docs',
    'A raw HTML control is used where a Koobiq component exists.'
  ),
  'component/reimplementation': rule(
    'component',
    'warning',
    'agent',
    'welcome--docs',
    'A hand-rolled widget re-implements a Koobiq component.'
  ),
  'component/slot-composition': rule(
    'component',
    'warning',
    'agent',
    'welcome--docs',
    'Compound slots are imitated or used outside their root.'
  ),
  'component/overlay-control': rule(
    'component',
    'error',
    'agent',
    'welcome--docs',
    'Overlay control render props are not spread onto a focusable control.'
  ),
  'component/layout-utilities': rule(
    'component',
    'info',
    'agent',
    'components-flexbox--docs',
    'A trivial layout wrapper could use FlexBox/Grid/spacing().'
  ),
  'component/experimental-usage': rule(
    'component',
    'info',
    'agent',
    'component-lifecycle--docs',
    'An experimental component may change in a minor release.'
  ),
  // props
  'props/value-and-default': rule(
    'props',
    'warning',
    'script',
    'forms--docs',
    'Both the controlled and the default value prop are set.'
  ),
  'props/controlled-without-handler': rule(
    'props',
    'warning',
    'script',
    'forms--docs',
    'A controlled prop is set without its change handler.'
  ),
  'props/onclick': rule(
    'props',
    'info',
    'script',
    'components-button--docs',
    'onClick is used on a pressable Koobiq component; prefer onPress.'
  ),
  'props/invalid-value': rule(
    'props',
    'warning',
    'script',
    'welcome--docs',
    'The literal value is not one of the allowed values of the prop.'
  ),
  'props/unknown-prop': rule(
    'props',
    'error',
    'agent',
    'welcome--docs',
    'The prop is not declared by the Koobiq component (unchecked JS files).'
  ),
  'props/onchange-event': rule(
    'props',
    'error',
    'agent',
    'forms--docs',
    'A value callback onChange(value) is treated as a DOM event.'
  ),
  'props/form-field-name': rule(
    'props',
    'warning',
    'agent',
    'forms--docs',
    'An uncontrolled field in a submitted form has no name.'
  ),
  'props/form-validation': rule(
    'props',
    'warning',
    'agent',
    'forms--docs',
    'Form validation is wired incorrectly (validationBehavior, Controller, errorMessage).'
  ),
  'props/link-as-button-href': rule(
    'props',
    'error',
    'agent',
    'components-link--docs',
    'Link rendered as a button ignores href.'
  ),
  'props/target-blank-rel': rule(
    'props',
    'warning',
    'agent',
    'components-link--docs',
    'target="_blank" without rel="noopener noreferrer".'
  ),
  'props/collection-item-id': rule(
    'props',
    'warning',
    'agent',
    'welcome--docs',
    'Collection items need a stable id.'
  ),
  'props/slotprops': rule(
    'props',
    'warning',
    'agent',
    'welcome--docs',
    'Inner elements are customized outside slotProps.'
  ),
  // typescript
  'typescript/redeclared-values': rule(
    'typescript',
    'warning',
    'agent',
    'welcome--docs',
    'A union or array duplicates an exported Koobiq value type.'
  ),
  'typescript/wrapper-props': rule(
    'typescript',
    'warning',
    'agent',
    'welcome--docs',
    'A wrapper is typed with DOM props or any instead of the Koobiq props type.'
  ),
  'typescript/suppressed-ds-types': rule(
    'typescript',
    'warning',
    'agent',
    'welcome--docs',
    'Koobiq types are bypassed with any, @ts-ignore or @ts-expect-error.'
  ),
  'typescript/shared-types-source': rule(
    'typescript',
    'info',
    'agent',
    'welcome--docs',
    'Shared types (Key, Selection, PressEvent…) are imported from React Aria instead of the DS.'
  ),
  // a11y
  'a11y/icon-button-label': rule(
    'a11y',
    'warning',
    'both',
    'components-iconbutton--docs',
    'An icon-only control has no accessible name.'
  ),
  'a11y/field-label': rule(
    'a11y',
    'warning',
    'both',
    'forms--docs',
    'A form field has no label, aria-label or aria-labelledby.'
  ),
  'a11y/collection-name': rule(
    'a11y',
    'warning',
    'agent',
    'welcome--docs',
    'A collection (Table, List, Menu, Tree…) has no accessible name.'
  ),
  'a11y/dialog-name': rule(
    'a11y',
    'warning',
    'agent',
    'components-modal--docs',
    'A dialog has no accessible name.'
  ),
  'a11y/clickable-non-interactive': rule(
    'a11y',
    'error',
    'agent',
    'welcome--docs',
    'A non-interactive element handles presses or clicks.'
  ),
  // i18n
  'i18n/hardcoded-text': rule(
    'i18n',
    'info',
    'script',
    'welcome--docs',
    'User-facing text bypasses the app i18n library.'
  ),
  'i18n/native-date-format': rule(
    'i18n',
    'info',
    'script',
    'utilities-dateformatter--docs',
    'Dates are formatted without @koobiq/date-formatter.'
  ),
  'i18n/provider-without-locale': rule(
    'i18n',
    'info',
    'script',
    'welcome--docs',
    '<Provider> gets no locale.'
  ),
  'i18n/date-value-type': rule(
    'i18n',
    'error',
    'agent',
    'utilities-dateformatter--docs',
    'Date components get Date objects or strings instead of @internationalized/date values.'
  ),
};

export const RULE_IDS = Object.keys(RULES);

export const ruleDocsUrl = (id) =>
  RULES[id]?.docs ? docsUrl(RULES[id].docs) : undefined;

/* ------------------------------------------------------------------ */
/* Small utilities                                                     */
/* ------------------------------------------------------------------ */

const readText = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const readJson = (file) => {
  const text = readText(file);

  if (text == null) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const exists = (file) => {
  try {
    fs.accessSync(file);

    return true;
  } catch {
    return false;
  }
};

const realpath = (file) => {
  try {
    return fs.realpathSync.native(file);
  } catch {
    return file;
  }
};

export const toPosix = (file) => file.split(path.sep).join('/');

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const uncapitalize = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/** Bounded Levenshtein distance; returns max + 1 when the bound is exceeded. */
export function levenshtein(a, b, max = 8) {
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prev = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);

      cur.push(value);
      if (value < rowMin) rowMin = value;
    }

    if (rowMin > max) return max + 1;
    prev = cur;
  }

  return prev[b.length];
}

/** Closest names by edit distance (≤ 3 or ≤ 20% of the length). */
export function closestNames(name, candidates, limit = 3) {
  const max = Math.max(3, Math.floor(name.length * 0.2));
  const scored = [];

  for (const candidate of candidates) {
    const distance = levenshtein(name, candidate, max);

    if (distance <= max) scored.push([distance, candidate]);
  }

  scored.sort((x, y) => x[0] - y[0] || x[1].localeCompare(y[1]));

  return scored.slice(0, limit).map(([, candidate]) => candidate);
}

/* ------------------------------------------------------------------ */
/* Package lookup                                                      */
/* ------------------------------------------------------------------ */

/**
 * Finds an installed package by walking up node_modules folders. Uses the
 * package.json path instead of require.resolve, because the DS `exports`
 * map does not expose ./package.json. Returns the realpath (pnpm-safe).
 */
export function findPackageDir(startDir, name) {
  let dir = path.resolve(startDir);

  for (;;) {
    const candidate = path.join(dir, 'node_modules', ...name.split('/'));

    if (exists(path.join(candidate, 'package.json')))
      return realpath(candidate);

    const parent = path.dirname(dir);

    if (parent === dir) return null;
    dir = parent;
  }
}

/** Resolves DS, tokens and icons packages for a product directory. */
export function resolvePackages(fromDir, overrides = {}) {
  const dsDir = overrides.dsDir
    ? realpath(path.resolve(overrides.dsDir))
    : findPackageDir(fromDir, DS_PACKAGE);

  const sibling = (name) =>
    findPackageDir(fromDir, name) ||
    (dsDir ? findPackageDir(dsDir, name) : null);

  return {
    dsDir,
    tokensDir: overrides.tokensDir
      ? realpath(path.resolve(overrides.tokensDir))
      : sibling(TOKENS_PACKAGE),
    iconsDir: overrides.iconsDir
      ? realpath(path.resolve(overrides.iconsDir))
      : sibling(ICONS_PACKAGE),
  };
}

/* ------------------------------------------------------------------ */
/* d.ts scanning                                                       */
/* ------------------------------------------------------------------ */

const docText = (doc) =>
  doc
    .replace(/^\s*\/\*\*?/, '')
    .replace(/\*\/\s*$/, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ');

export const deprecationMessage = (doc) => {
  const text = docText(doc);
  const index = text.indexOf('@deprecated');

  if (index === -1) return null;

  return text
    .slice(index + '@deprecated'.length)
    .replace(/@\w+.*$/, '')
    .trim();
};

const resolveDts = (fromFile, specifier) => {
  const base = path.resolve(
    path.dirname(fromFile),
    specifier.replace(/\.js$/, '')
  );

  const candidates = [`${base}.d.ts`, path.join(base, 'index.d.ts')];

  return candidates.find(exists) || null;
};

const parseSpecifierList = (list, statementIsType) =>
  list
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const typeOnly = statementIsType || /^type\s+/.test(part);
      const clean = part.replace(/^type\s+/, '');
      const [imported, alias] = clean.split(/\s+as\s+/);

      return {
        imported: imported.trim(),
        name: (alias || imported).trim(),
        typeOnly,
      };
    });

const JSDOC_BEFORE = /\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*$/;

/**
 * Collects the export map of a d.ts entry by following `export *` and
 * named re-exports. External re-exports (react-core/primitives) keep their
 * origin so suggestions can point at the public DS entry.
 */
export function collectDtsExports(
  entryFile,
  seen = new Set(),
  out = new Map()
) {
  if (!entryFile || seen.has(entryFile)) return out;
  seen.add(entryFile);

  const text = readText(entryFile);

  if (text == null) return out;

  const statement =
    /export\s+(?:\*\s+from\s+['"]([^'"]+)['"]|\*\s+as\s+(\w+)\s+from\s+['"][^'"]+['"]|(type\s+)?\{([^}]*)\}(?:\s+from\s+['"]([^'"]+)['"])?|declare\s+(?:abstract\s+)?(const|let|var|function|class|enum|namespace)\s+([A-Za-z_$][\w$]*)|(type|interface)\s+([A-Za-z_$][\w$]*)|default\b)/g;

  for (const match of text.matchAll(statement)) {
    const before = text.slice(Math.max(0, match.index - 2000), match.index);
    const docMatch = before.match(JSDOC_BEFORE);
    const deprecated = docMatch ? deprecationMessage(docMatch[0]) : null;

    if (match[1]) {
      if (match[1].startsWith('.')) {
        collectDtsExports(resolveDts(entryFile, match[1]), seen, out);
      }
    } else if (match[2]) {
      out.set(match[2], { kind: 'value', file: entryFile });
    } else if (match[4] != null) {
      const external = match[5] && !match[5].startsWith('.') ? match[5] : null;

      for (const spec of parseSpecifierList(match[4], Boolean(match[3]))) {
        if (!out.has(spec.name)) {
          out.set(spec.name, {
            kind: spec.typeOnly ? 'type' : 'value',
            file: entryFile,
            external,
            externalName: spec.imported,
          });
        }
      }
    } else if (match[7]) {
      out.set(match[7], {
        kind: 'value',
        declaration: match[6],
        file: entryFile,
        ...(deprecated != null && { deprecated: deprecated || 'Deprecated.' }),
      });
    } else if (match[9]) {
      if (!out.has(match[9]) || deprecated != null) {
        out.set(match[9], {
          kind: 'type',
          file: entryFile,
          ...(deprecated != null && {
            deprecated: deprecated || 'Deprecated.',
          }),
        });
      }
    }
  }

  return out;
}

const COMPONENTS_DIR_RE = /^components[\\/]([^\\/]+)[\\/]/;

/**
 * Finds `@deprecated` members of props types. Depth-aware: a deprecated
 * member of `slotProps` is reported as `slotProps.<name>`, so `<DatePicker
 * label>` is not confused with the deprecated `slotProps.label`.
 */
export function scanDeprecatedMembers(text) {
  const results = [];
  const lines = text.split(/\r?\n/);
  const stack = [];
  let doc = null;
  let docBuffer = null;
  let pendingAlias = null;

  for (const raw of lines) {
    const line = raw.trim();

    if (docBuffer) {
      docBuffer.push(line);

      if (line.includes('*/')) {
        doc = docBuffer.join('\n');
        docBuffer = null;
      }

      continue;
    }

    if (line.startsWith('/**')) {
      if (line.includes('*/')) doc = line;
      else docBuffer = [line];

      continue;
    }

    if (!line || line.startsWith('//')) continue;

    const alias = line.match(
      /^(?:export\s+)?(?:declare\s+)?(?:type|interface)\s+([A-Za-z_$][\w$]*)/
    );

    if (alias) pendingAlias = alias[1];

    const member = line.match(
      /^(?:readonly\s+)?['"]?([A-Za-z_$][\w$-]*)['"]?\??:/
    );

    if (member && doc && doc.includes('@deprecated')) {
      const aliasIndex = stack.findLastIndex((entry) => entry.kind === 'alias');

      if (aliasIndex !== -1) {
        const members = stack
          .slice(aliasIndex + 1)
          .filter((entry) => entry.kind === 'member')
          .map((entry) => entry.name);

        results.push({
          alias: stack[aliasIndex].name,
          path: members,
          name: member[1],
          message: deprecationMessage(doc) || 'Deprecated.',
        });
      }
    }

    doc = null;

    for (const char of line.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""')) {
      if (char === '{') {
        if (pendingAlias) {
          stack.push({ kind: 'alias', name: pendingAlias });
          pendingAlias = null;
        } else if (member && line.trimEnd().endsWith('{')) {
          stack.push({ kind: 'member', name: member[1] });
        } else {
          stack.push({ kind: 'other' });
        }
      } else if (char === '}') {
        stack.pop();
      }
    }

    if (pendingAlias && /[;=]\s*$/.test(line) && !line.includes('{')) {
      pendingAlias = line.endsWith('=') ? pendingAlias : null;
    }
  }

  return results;
}

const DEPRECATE_MESSAGE_RE =
  /(['"`])([A-Z][\w.]*): the "([\w$-]+)" prop is deprecated(?: and ignored)?\.\s*((?:(?!\1)[^\n])*)\1/g;

const replacementFrom = (message) => {
  const match =
    message.match(/Use "([\w$.-]+)" prop/) ||
    message.match(/use [`"']?([\w$.-]+)[`"']? (?:prop )?instead/i);

  return match ? match[1] : null;
};

const listFiles = (dir, filter, out = []) => {
  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') listFiles(full, filter, out);
    } else if (filter(entry.name)) {
      out.push(full);
    }
  }

  return out;
};

/* ------------------------------------------------------------------ */
/* DS knowledge                                                        */
/* ------------------------------------------------------------------ */

const HASHED_CLASS_RE = /^kbq-[a-z0-9]+(?:-[A-Za-z0-9_]+)*-[0-9a-f]{6}$/;

export const isHashedClassName = (name) => HASHED_CLASS_RE.test(name);

const entryKey = (exportsKey) =>
  exportsKey === '.' ? '' : exportsKey.slice(1);

/** Analyzes dist/style.css: defined/read variables, override points, classes. */
export function analyzeDsStyles(cssText, tokenNames = new Set()) {
  const defined = new Set();
  const read = new Set();
  const withFallback = new Set();
  const hashedClasses = new Set();
  const filePrefixes = new Set();
  const globalClasses = new Set();

  if (!cssText) {
    return {
      defined,
      read,
      overridePoints: new Set(),
      hashedClasses,
      filePrefixes,
      globalClasses,
    };
  }

  for (const match of cssText.matchAll(/(--kbq-[a-z0-9_-]+)\s*:/gi)) {
    defined.add(match[1]);
  }

  for (const match of cssText.matchAll(
    /var\(\s*(--kbq-[a-z0-9_-]+)\s*(,)?/gi
  )) {
    read.add(match[1]);
    if (match[2]) withFallback.add(match[1]);
  }

  for (const match of cssText.matchAll(/\.(kbq-[A-Za-z0-9_-]+)/g)) {
    const name = match[1];

    if (isHashedClassName(name)) {
      hashedClasses.add(name);
      filePrefixes.add(name.split('-')[1]);
    } else {
      globalClasses.add(name);
    }
  }

  const overridePoints = new Set();

  for (const name of withFallback) {
    if (!tokenNames.has(name)) overridePoints.add(name);
  }

  for (const name of defined) {
    if (!/^--kbq-(layer|transition)-/.test(name)) overridePoints.add(name);
  }

  return {
    defined,
    read,
    overridePoints,
    hashedClasses,
    filePrefixes,
    globalClasses,
  };
}

const OPTIONAL_PEER_ENTRIES = ['./markdown', './code-block'];

const collectBareImports = (
  file,
  seen = new Set(),
  depth = 0,
  out = new Set()
) => {
  if (!file || seen.has(file) || depth > 5) return out;
  seen.add(file);

  const text = readText(file);

  if (text == null) return out;

  for (const match of text.matchAll(
    /(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g
  )) {
    const spec = match[1];

    if (spec.startsWith('.')) {
      const next = path.resolve(path.dirname(file), spec);

      collectBareImports(
        [next, `${next}.js`, path.join(next, 'index.js')].find(
          (candidate) => exists(candidate) && fs.statSync(candidate).isFile()
        ),
        seen,
        depth + 1,
        out
      );
    } else {
      out.add(
        spec.startsWith('@')
          ? spec.split('/').slice(0, 2).join('/')
          : spec.split('/')[0]
      );
    }
  }

  return out;
};

const FIELD_FALLBACK = [
  'Autocomplete',
  'CheckboxGroup',
  'DateInput',
  'DatePicker',
  'Input',
  'InputNumber',
  'RadioGroup',
  'SearchInput',
  'SelectNext',
  'TagInput',
  'Textarea',
  'TimePicker',
  'TimeRange',
  'TreeSelect',
];

/** Loads everything the checks need to know about an installed DS. */
export function loadDsKnowledge(dsDir, tokenNames = new Set()) {
  const pkg = readJson(path.join(dsDir, 'package.json'));

  if (!pkg) return null;

  const exportsField =
    pkg.exports && typeof pkg.exports === 'object' ? pkg.exports : {};

  const entries = new Map();
  const exportIndex = new Map();
  const jsRoots = new Set();

  for (const [key, value] of Object.entries(exportsField)) {
    const types = typeof value === 'object' ? value.types : null;

    const main =
      typeof value === 'object' ? value.default || value.import : value;

    if (types) {
      const file = path.resolve(dsDir, types);
      const map = collectDtsExports(file);

      entries.set(key, { key, types: file, exports: map });

      for (const [name, info] of map) {
        if (!exportIndex.has(name))
          exportIndex.set(name, { ...info, entry: key });
      }

      jsRoots.add(path.dirname(file));
    } else {
      entries.set(key, {
        key,
        file: main ? path.resolve(dsDir, main) : null,
        exports: null,
      });
    }

    if (typeof main === 'string' && main.endsWith('.js')) {
      jsRoots.add(path.dirname(path.resolve(dsDir, main)));
    }
  }

  const distRoot =
    [...jsRoots].sort((a, b) => a.length - b.length)[0] ||
    path.join(dsDir, 'dist');

  // Deprecated props: runtime deprecate() messages win; d.ts adds the rest.
  const deprecatedProps = new Map();

  const addDeprecatedProp = (component, prop, info) => {
    if (!deprecatedProps.has(component))
      deprecatedProps.set(component, new Map());

    const map = deprecatedProps.get(component);

    if (!map.has(prop) || info.source === 'runtime') map.set(prop, info);
  };

  const jsFiles = listFiles(distRoot, (name) => name.endsWith('.js'));

  for (const file of jsFiles) {
    const text = readText(file);

    if (!text || !text.includes('is deprecated')) continue;

    for (const match of text.matchAll(DEPRECATE_MESSAGE_RE)) {
      const [, , component, prop, rest] = match;

      addDeprecatedProp(component, prop, {
        replacement: replacementFrom(rest),
        message:
          `${component}: the "${prop}" prop is deprecated. ${rest}`.trim(),
        source: 'runtime',
      });
    }
  }

  const dtsFiles = listFiles(distRoot, (name) => name.endsWith('.d.ts'));
  const enums = new Map();
  const fieldComponents = new Set();
  const componentFolders = new Map();

  for (const file of dtsFiles) {
    const text = readText(file);

    if (!text) continue;

    const folder = path.relative(distRoot, file).match(COMPONENTS_DIR_RE)?.[1];

    if (folder) {
      if (!componentFolders.has(folder)) componentFolders.set(folder, []);
      componentFolders.get(folder).push(file);
    }

    if (text.includes('@deprecated')) {
      for (const member of scanDeprecatedMembers(text)) {
        const fromAlias = member.alias.replace(
          /(?:Base)?(?:Deprecated)?Props$/,
          ''
        );

        const component = exportIndex.has(fromAlias) ? fromAlias : folder;

        if (!component) continue;

        if (member.path.length === 0) {
          addDeprecatedProp(component, member.name, {
            replacement: replacementFrom(member.message),
            message: member.message,
            source: 'dts',
          });
        } else if (member.path.length === 1 && member.path[0] === 'slotProps') {
          addDeprecatedProp(component, `slotProps.${member.name}`, {
            replacement: null,
            message: member.message,
            source: 'dts',
          });
        }
      }
    }

    for (const match of text.matchAll(
      /export\s+declare\s+const\s+([a-z][A-Za-z0-9]*)Prop([A-Z][A-Za-z0-9]*)\s*:\s*readonly\s*\[([^\]]*)\]/g
    )) {
      const component = capitalize(match[1]);

      if (!exportIndex.has(component)) continue;

      const values = [...match[3].matchAll(/"([^"]*)"|'([^']*)'/g)].map(
        (v) => v[1] ?? v[2]
      );

      if (!enums.has(component)) enums.set(component, new Map());
      enums.get(component).set(uncapitalize(match[2]), values);
    }

    if (
      folder &&
      /label\?:\s*FormFieldLabelProps/.test(text) &&
      exportIndex.has(folder)
    ) {
      fieldComponents.add(folder);
    }
  }

  for (const name of FIELD_FALLBACK) {
    if (exportIndex.has(name)) fieldComponents.add(name);
  }

  // Drop d.ts replacements that point at props the component doesn't have
  // (e.g. JSDoc "isVisitable" while the prop is "allowVisited").
  for (const [component, props] of deprecatedProps) {
    const files = componentFolders.get(component) || [];
    const sources = files.map(readText).join('\n');

    for (const [prop, info] of props) {
      if (info.source !== 'dts' || !info.replacement) continue;

      const declared = new RegExp(`\\b${info.replacement}\\??:`).test(sources);

      if (!declared)
        props.set(prop, {
          ...info,
          replacement: null,
          replacementUnverified: info.replacement,
        });
    }
  }

  const optionalPeers = new Map();
  const peerMeta = pkg.peerDependenciesMeta || {};

  const optional = Object.keys(peerMeta).filter(
    (name) => peerMeta[name]?.optional
  );

  for (const key of OPTIONAL_PEER_ENTRIES) {
    const value = exportsField[key];

    const main =
      value && typeof value === 'object' ? value.default || value.import : null;

    if (!main) continue;

    const imports = collectBareImports(path.resolve(dsDir, main));

    optionalPeers.set(
      key,
      optional.filter((name) => imports.has(name))
    );
  }

  const styleFile = path.join(
    dsDir,
    typeof exportsField['./style.css'] === 'string'
      ? exportsField['./style.css']
      : 'dist/style.css'
  );

  const styles = analyzeDsStyles(readText(styleFile), tokenNames);

  const deprecatedExports = new Map();

  for (const [name, info] of exportIndex) {
    if (info.deprecated) deprecatedExports.set(name, info.deprecated);
  }

  return {
    dir: dsDir,
    version: pkg.version,
    exportsField,
    entries,
    exportIndex,
    deprecatedProps,
    deprecatedExports,
    enums,
    fieldComponents,
    optionalPeers,
    peerDependencies: pkg.peerDependencies || {},
    dependencies: pkg.dependencies || {},
    styles,
  };
}

/* ------------------------------------------------------------------ */
/* Colors                                                              */
/* ------------------------------------------------------------------ */

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const gammaEncode = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const parseNumber = (token, percentScale = 1) => {
  if (token == null) return NaN;

  const text = String(token).trim();

  if (text.endsWith('%')) return (parseFloat(text) / 100) * percentScale;

  return parseFloat(text);
};

const parseAlpha = (token) => {
  if (token == null || token === '') return 1;

  return clamp01(parseNumber(token, 1));
};

const splitArgs = (inner) => {
  const [main, alpha] = inner.split('/');

  const parts = main.includes(',')
    ? main.split(',').map((p) => p.trim())
    : main.trim().split(/\s+/);

  if (alpha != null) parts.push(alpha.trim());

  return parts.filter((p) => p !== '');
};

const hslToRgb = (h, s, l) => {
  const a = s * Math.min(l, 1 - l);

  const f = (n) => {
    const k = (n + h / 30) % 12;

    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };

  return [f(0), f(8), f(4)];
};

const oklchToRgb = (L, C, H) => {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    gammaEncode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gammaEncode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gammaEncode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
};

const NAMED_COLORS = {
  white: [255, 255, 255, 1],
  black: [0, 0, 0, 1],
  red: [255, 0, 0, 1],
  green: [0, 128, 0, 1],
  blue: [0, 0, 255, 1],
  gray: [128, 128, 128, 1],
  grey: [128, 128, 128, 1],
};

/** Parses a CSS color literal into [r, g, b, a] (0-255, alpha 0-1). */
export function parseColor(input) {
  const value = String(input).trim().toLowerCase();

  if (NAMED_COLORS[value]) return NAMED_COLORS[value];

  const hex = value.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);

  if (hex) {
    let digits = hex[1];

    if (digits.length <= 4) digits = [...digits].map((d) => d + d).join('');

    const n = (i) => parseInt(digits.slice(i, i + 2), 16);

    return [
      n(0),
      n(2),
      n(4),
      digits.length === 8 ? Math.round((n(6) / 255) * 100) / 100 : 1,
    ];
  }

  const fn = value.match(/^(rgba?|hsla?|oklch)\((.*)\)$/);

  if (!fn) return null;

  const args = splitArgs(fn[2]);
  let rgb;
  let alpha = 1;

  if (fn[1].startsWith('rgb')) {
    rgb = args.slice(0, 3).map((arg) => parseNumber(arg, 255) / 255);
    alpha = parseAlpha(args[3]);
  } else if (fn[1].startsWith('hsl')) {
    const h = parseFloat(args[0]);
    const s = parseNumber(args[1], 1);
    const l = parseNumber(args[2], 1);

    rgb = hslToRgb(h, s, l);
    alpha = parseAlpha(args[3]);
  } else {
    const L = parseNumber(args[0], 1);
    const C = parseNumber(args[1], 0.4);
    const H = parseFloat(args[2]) || 0;

    rgb = oklchToRgb(L, C, H);
    alpha = parseAlpha(args[3]);
  }

  if (rgb.some((c) => Number.isNaN(c))) return null;

  return [
    ...rgb.map((c) => Math.round(clamp01(c) * 255)),
    Math.round(alpha * 100) / 100,
  ];
}

export const colorKey = (rgba) => (rgba ? rgba.join(',') : null);

const COLOR_LITERAL_RE =
  /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\([^()]*\)|\b(?:white|black)\b/g;

/** Finds color literals in a CSS value, ignoring var() fallbacks. */
export function findColorLiterals(value) {
  const results = [];
  const text = String(value);

  for (const match of text.matchAll(COLOR_LITERAL_RE)) {
    const before = text.slice(0, match.index);
    const open = (before.match(/var\(/g) || []).length;
    const closed = (before.match(/\)/g) || []).length;

    if (open > closed) continue;
    if (!parseColor(match[0])) continue;

    results.push({ literal: match[0], index: match.index });
  }

  return results;
}

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

const TOKEN_LINE_RE =
  /^\s*(--kbq-[a-z0-9_-]+)\s*:\s*([^;]*);[^\n]*?(?:\/\*\s*(DEPRECATED[^*]*)\*\/)?\s*$/gim;

const TOKEN_FILES = {
  new: {
    root: 'web/new/css-tokens.css',
    light: 'web/new/css-tokens-light.css',
    dark: 'web/new/css-tokens-dark.css',
  },
  legacy: {
    root: 'web/css-tokens.css',
    light: 'web/css-tokens-light.css',
    dark: 'web/css-tokens-dark.css',
    font: 'web/css-tokens-font.css',
  },
};

export function parseTokenCss(text, theme, into = new Map()) {
  if (!text) return into;

  for (const match of text.matchAll(TOKEN_LINE_RE)) {
    const [, name, value, deprecated] = match;
    const info = into.get(name) || { values: {} };

    info.values[theme] = value.trim();

    if (deprecated) {
      const hint = deprecated.replace(/^DEPRECATED:?\s*/, '').trim();

      info.deprecated = hint === 'true' || hint === '' ? 'Deprecated.' : hint;
    }

    into.set(name, info);
  }

  return into;
}

const TOKEN_FAMILIES = [
  ['background', /^--kbq-(?:background|states-background)-/],
  ['foreground', /^--kbq-(?:foreground|states-foreground)-/],
  ['line', /^--kbq-(?:line|states-line)-/],
  ['icon', /^--kbq-(?:icon|states-icon)-/],
  ['shadow', /^--kbq-shadow-/],
];

export const tokenFamily = (name) =>
  TOKEN_FAMILIES.find(([, re]) => re.test(name))?.[0] || 'other';

export const propertyFamily = (prop) => {
  const p = prop.toLowerCase();

  if (p === 'color' || p === 'caret-color' || p === 'text-decoration-color')
    return 'foreground';
  if (p.startsWith('background')) return 'background';
  if (p === 'fill' || p === 'stroke') return 'icon';
  if (
    p.startsWith('border') ||
    p.startsWith('outline') ||
    p === 'column-rule-color'
  )
    return 'line';
  if (p.includes('shadow')) return 'shadow';

  return 'other';
};

/** Loads both token sets plus a color index of theme-aware tokens. */
export function loadTokenKnowledge(tokensDir) {
  const pkg = readJson(path.join(tokensDir, 'package.json')) || {};
  const sets = {};

  for (const [set, files] of Object.entries(TOKEN_FILES)) {
    const map = new Map();

    for (const [theme, rel] of Object.entries(files)) {
      parseTokenCss(readText(path.join(tokensDir, rel)), theme, map);
    }

    sets[set] = map;
  }

  const colorIndex = new Map();

  for (const [name, info] of sets.new) {
    if (
      info.deprecated ||
      !/^--kbq-(?:background|foreground|line|icon|states)-/.test(name)
    )
      continue;

    for (const theme of ['light', 'dark']) {
      const raw = info.values[theme];

      if (!raw || raw.includes('var(')) continue;

      const key = colorKey(parseColor(raw));

      if (!key) continue;
      if (!colorIndex.has(key)) colorIndex.set(key, []);
      colorIndex.get(key).push({ name, theme });
    }
  }

  const sizes = new Map();

  for (const [name, info] of sets.new) {
    const match = name.match(/^--kbq-size-[a-z0-9-]+$/);
    const raw = info.values.root;

    if (match && raw && /^\d+px$/.test(raw) && !info.deprecated) {
      if (!sizes.has(raw)) sizes.set(raw, []);
      sizes.get(raw).push(name);
    }
  }

  return { dir: tokensDir, version: pkg.version, sets, colorIndex, sizes };
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export function loadIconKnowledge(iconsDir) {
  const manifest = readJson(path.join(iconsDir, 'manifest.json'));
  const pkg = readJson(path.join(iconsDir, 'package.json')) || {};
  const names = new Set();
  const byBase = new Map();
  const byKeyword = new Map();

  for (const icon of manifest?.icons || []) {
    names.add(icon.name);

    const base = icon.name
      .replace(/^Icon/, '')
      .replace(/\d+$/, '')
      .toLowerCase();

    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(icon.name);

    for (const keyword of icon.keywords || []) {
      const key = String(keyword).toLowerCase();

      if (!byKeyword.has(key)) byKeyword.set(key, []);
      byKeyword.get(key).push(icon.name);
    }
  }

  return { dir: iconsDir, version: pkg.version, names, byBase, byKeyword };
}

/** Suggests @koobiq/react-icons names for an icon from another library. */
export function suggestIcons(icons, foreignName) {
  if (!icons) return [];

  const base = String(foreignName)
    .replace(/^(?:Icon|Fa|Md|Hi|Bi|Ai|Ri|Tb|Lu|Io5?|Bs|Fi)(?=[A-Z0-9])/, '')
    .replace(
      /(?:Icon|Outlined|Filled|Rounded|Sharp|TwoTone|Outline|Solid)$/,
      ''
    )
    .replace(/\d+$/, '')
    .toLowerCase();

  if (!base) return [];

  return (icons.byBase.get(base) || icons.byKeyword.get(base) || []).slice(
    0,
    3
  );
}

/* ------------------------------------------------------------------ */
/* Knowledge cache                                                     */
/* ------------------------------------------------------------------ */

const knowledgeCache = new Map();

/**
 * Loads (and caches by realpath) the knowledge for one product package.
 * Missing packages give `null` parts; checks skip what they can't decide.
 */
export function loadKnowledge(fromDir, overrides = {}) {
  const { dsDir, tokensDir, iconsDir } = resolvePackages(fromDir, overrides);
  const key = [dsDir, tokensDir, iconsDir].join('|');

  if (knowledgeCache.has(key)) return knowledgeCache.get(key);

  const tokens = tokensDir ? loadTokenKnowledge(tokensDir) : null;

  const tokenNames = new Set([
    ...(tokens?.sets.new.keys() || []),
    ...(tokens?.sets.legacy.keys() || []),
  ]);

  const ds = dsDir ? loadDsKnowledge(dsDir, tokenNames) : null;
  const icons = iconsDir ? loadIconKnowledge(iconsDir) : null;
  const knowledge = { ds, tokens, icons };

  knowledgeCache.set(key, knowledge);

  return knowledge;
}

export const clearKnowledgeCache = () => knowledgeCache.clear();

/* ------------------------------------------------------------------ */
/* Decisions                                                           */
/* ------------------------------------------------------------------ */

const finding = (id, message, extra = {}) => ({
  id,
  message,
  confidence: 'high',
  ...extra,
});

const OTHER_UI_KITS = [
  ['@mui/material', 'MUI'],
  ['@mui/joy', 'MUI Joy'],
  ['@mui/lab', 'MUI'],
  ['@mui/x-date-pickers', 'MUI X'],
  ['antd', 'Ant Design'],
  ['@chakra-ui/', 'Chakra UI'],
  ['@mantine/', 'Mantine'],
  ['@radix-ui/', 'Radix UI'],
  ['@headlessui/react', 'Headless UI'],
  ['react-bootstrap', 'React Bootstrap'],
  ['primereact', 'PrimeReact'],
  ['@fluentui/', 'Fluent UI'],
  ['@blueprintjs/', 'Blueprint'],
  ['react-select', 'react-select'],
  ['react-datepicker', 'react-datepicker'],
  ['react-modal', 'react-modal'],
  ['react-tooltip', 'react-tooltip'],
  ['react-toastify', 'react-toastify'],
  ['sonner', 'sonner'],
  ['react-hot-toast', 'react-hot-toast'],
  ['@ark-ui/', 'Ark UI'],
  ['@nextui-org/', 'NextUI'],
  ['@heroui/', 'HeroUI'],
];

const UI_KIT_INFO_ONLY = [
  '@radix-ui/react-slot',
  '@radix-ui/react-visually-hidden',
];

const ICON_LIBRARIES = [
  'lucide-react',
  'react-icons',
  '@heroicons/',
  '@tabler/icons-react',
  '@phosphor-icons/react',
  '@radix-ui/react-icons',
  '@mui/icons-material',
  '@fortawesome/',
  'react-feather',
  '@ant-design/icons',
  '@iconify/react',
];

const KIT_TO_DS = {
  dialog: 'Modal',
  modal: 'Modal',
  alertdialog: 'Modal',
  drawer: 'SidePanel',
  sheet: 'SidePanel',
  select: 'SelectNext',
  combobox: 'Autocomplete',
  autocomplete: 'Autocomplete',
  switch: 'Toggle',
  toggle: 'Toggle',
  checkbox: 'Checkbox',
  radio: 'RadioGroup',
  radiogroup: 'RadioGroup',
  tooltip: 'Tooltip',
  popover: 'Popover',
  dropdownmenu: 'DropdownMenu',
  menu: 'Menu',
  tabs: 'Tabs',
  accordion: 'Accordion',
  button: 'Button',
  iconbutton: 'IconButton',
  input: 'Input',
  textfield: 'Input',
  textarea: 'Textarea',
  badge: 'Badge',
  chip: 'Tag',
  tag: 'Tag',
  avatar: 'Username',
  breadcrumb: 'Breadcrumbs',
  breadcrumbs: 'Breadcrumbs',
  table: 'Table',
  datagrid: 'Table',
  skeleton: 'SkeletonBlock',
  spinner: 'ProgressSpinner',
  circularprogress: 'ProgressSpinner',
  linearprogress: 'ProgressBar',
  progress: 'ProgressBar',
  separator: 'Divider',
  divider: 'Divider',
  toast: 'ToastProvider',
  toaster: 'ToastProvider',
  alert: 'Alert',
  calendar: 'Calendar',
  datepicker: 'DatePicker',
  link: 'Link',
  typography: 'Typography',
  card: null,
};

const KIT_KEYS = Object.keys(KIT_TO_DS).sort((a, b) => b.length - a.length);

const kitSuggestion = (ds, importedNames, source) => {
  const candidates = [
    ...importedNames,
    source
      .split('/')
      .pop()
      .replace(/^react-/, ''),
  ].map((n) =>
    String(n || '')
      .replace(/[^a-z]/gi, '')
      .toLowerCase()
  );

  for (const candidate of candidates) {
    const key = KIT_KEYS.find(
      (k) => candidate === k || candidate.startsWith(k)
    );

    const target = key ? KIT_TO_DS[key] : null;

    if (target && (!ds || ds.exportIndex.has(target))) return target;
  }

  return null;
};

const isTypeOnlyImport = (fact) =>
  fact.typeOnly ||
  (fact.specifiers?.length > 0 && fact.specifiers.every((s) => s.typeOnly));

/**
 * Import decisions. `fact`: { source, kind, typeOnly?, specifiers: [{ imported,
 * local, kind: 'named'|'default'|'namespace', typeOnly }] }.
 */
export function checkImport(fact, ctx = {}) {
  const { knowledge = {} } = ctx;
  const ds = knowledge.ds;
  const source = fact.source;
  const results = [];

  if (!source || source.startsWith('.') || source.startsWith('/')) {
    if (/node_modules[\\/]@koobiq[\\/]/.test(source || '')) {
      results.push(
        finding(
          'import/deep',
          `Relative import into node_modules: "${source}".`,
          {
            suggestion:
              'Import from the package name and its public entry points.',
          }
        )
      );
    }

    return results;
  }

  if (source === DS_PACKAGE || source.startsWith(`${DS_PACKAGE}/`)) {
    const sub = source.slice(DS_PACKAGE.length);
    const key = sub === '' ? '.' : `.${sub}`;

    if (ds && !ds.exportsField[key]) {
      const publicEntries = Object.keys(ds.exportsField).map(
        (k) => `${DS_PACKAGE}${entryKey(k)}`
      );

      results.push(
        finding(
          'import/deep',
          `"${source}" is not a public entry point of ${DS_PACKAGE}.`,
          {
            suggestion: `Use one of: ${publicEntries.join(', ')}.`,
            fixable: /\/dist\/style\.css$/.test(source) ? 'safe' : 'assisted',
            fix: /\/dist\/style\.css$/.test(source)
              ? {
                  kind: 'replace-source',
                  replacement: `${DS_PACKAGE}/style.css`,
                }
              : undefined,
          }
        )
      );

      return results;
    }

    if (!ds && /\/(?:dist|src|lib)\//.test(source)) {
      results.push(
        finding(
          'import/deep',
          `"${source}" imports a private path of ${DS_PACKAGE}.`
        )
      );

      return results;
    }

    const entry = ds?.entries.get(key);

    if (!entry?.exports) return results;

    for (const spec of fact.specifiers || []) {
      if (spec.kind !== 'named') continue;

      const info = entry.exports.get(spec.imported);

      if (!info) {
        const elsewhere = [...ds.entries.values()].find((e) =>
          e.exports?.has(spec.imported)
        );

        const close = closestNames(spec.imported, entry.exports.keys(), 2);

        results.push(
          finding(
            'import/unknown-export',
            `"${spec.imported}" is not exported by "${source}".`,
            {
              specifier: spec.imported,
              suggestion: elsewhere
                ? `Import it from "${DS_PACKAGE}${entryKey(elsewhere.key)}".`
                : close.length
                  ? `Did you mean ${close.map((n) => `"${n}"`).join(' or ')}?`
                  : 'Check the installed version of the DS.',
              fixable: elsewhere ? 'safe' : 'manual',
            }
          )
        );

        continue;
      }

      if (info.deprecated) {
        const isComponent =
          /^[A-Z]/.test(spec.imported) && info.kind === 'value';

        results.push(
          finding(
            isComponent ? 'deprecated/component' : 'deprecated/export',
            `"${spec.imported}" is deprecated: ${info.deprecated}`,
            {
              specifier: spec.imported,
              suggestion: info.deprecated,
              fixable: 'assisted',
            }
          )
        );
      }
    }

    return results;
  }

  const internal = INTERNAL_PACKAGES.find(
    (p) => source === p || source.startsWith(`${p}/`)
  );

  if (internal) {
    if (source !== internal) {
      results.push(
        finding(
          'import/deep',
          `"${source}" imports a private path of ${internal}.`
        )
      );

      return results;
    }

    if (isTypeOnlyImport(fact) && ds) {
      const reexported = (fact.specifiers || []).every((s) =>
        ds.exportIndex.has(s.imported)
      );

      if (!reexported) return results;
    }

    const documented = DOCUMENTED_INTERNAL_EXPORTS[internal] || [];

    // Documented hooks/utilities/primitives are public API of these
    // packages (Storybook "Hooks/*", "Utilities/*", "Primitives/*").
    const names = (fact.specifiers || [])
      .map((s) => s.imported)
      .filter((name) => name && !documented.includes(name));

    if ((fact.specifiers || []).length > 0 && names.length === 0) {
      return results;
    }

    const reexported = ds ? names.filter((n) => ds.exportIndex.has(n)) : [];

    results.push(
      finding(
        'import/internal-layer',
        `${internal} is an internal layer of the Koobiq DS.`,
        {
          suggestion:
            reexported.length && reexported.length === names.length
              ? `Import { ${reexported.join(', ')} } from "${DS_PACKAGE}".`
              : 'Use the public API of @koobiq/react-components; internal packages may change without notice.',
          confidence:
            reexported.length === names.length && names.length
              ? 'high'
              : 'medium',
          fixable:
            reexported.length && reexported.length === names.length
              ? 'safe'
              : 'manual',
        }
      )
    );

    return results;
  }

  if (/^@koobiq\/react-icons\/(?:dist|lib|src)\//.test(source)) {
    results.push(
      finding(
        'import/deep',
        `"${source}" imports a private path of @koobiq/react-icons.`,
        {
          suggestion: 'Import icons from "@koobiq/react-icons".',
          fixable: 'safe',
        }
      )
    );

    return results;
  }

  if (
    source === 'react-aria-components' ||
    source === 'react-aria' ||
    source === 'react-stately' ||
    /^@react-(?:aria|stately)\//.test(source)
  ) {
    results.push(
      finding(
        'import/react-aria-direct',
        `"${source}" is used directly; Koobiq components wrap React Aria.`,
        {
          suggestion:
            'Prefer the Koobiq component. For custom widgets keep React Aria on the versions @koobiq/react-primitives pins.',
          confidence: 'medium',
        }
      )
    );

    return results;
  }

  const allowKits = ctx.config?.uiKits?.allow || [];

  const kit = OTHER_UI_KITS.find(
    ([prefix]) => source === prefix || source.startsWith(prefix)
  );

  const shadcn = /^(?:@|~)\/components\/ui\/([\w-]+)$/.exec(source);

  if (
    (kit || shadcn) &&
    !allowKits.some((allowed) => source.startsWith(allowed))
  ) {
    const label = kit ? kit[1] : 'shadcn/ui';

    const target = kitSuggestion(
      ds,
      (fact.specifiers || []).map((s) => s.imported),
      source
    );

    const infoOnly = UI_KIT_INFO_ONLY.includes(source);

    results.push(
      finding(
        'import/other-ui-kit',
        `${label} is used next to the Koobiq design system.`,
        {
          severity: infoOnly ? 'info' : undefined,
          suggestion: target
            ? `Use ${target} from "${DS_PACKAGE}".`
            : 'Use the matching Koobiq component, or record an exception if Koobiq has no equivalent.',
          confidence: target ? 'high' : 'medium',
          data: { kit: label, target },
        }
      )
    );

    return results;
  }

  const allowIcons = ctx.config?.icons?.allow || [];

  const iconLib = ICON_LIBRARIES.find(
    (prefix) => source === prefix || source.startsWith(prefix)
  );

  if (iconLib && !allowIcons.some((allowed) => source.startsWith(allowed))) {
    const suggestions = (fact.specifiers || []).flatMap((s) =>
      suggestIcons(knowledge.icons, s.imported)
    );

    results.push(
      finding(
        'import/other-icons',
        `Icons come from "${source}" instead of ${ICONS_PACKAGE}.`,
        {
          suggestion: suggestions.length
            ? `Candidates: ${[...new Set(suggestions)].slice(0, 5).join(', ')}.`
            : `Pick an icon from ${ICONS_PACKAGE} (see the Icons page).`,
        }
      )
    );
  }

  return results;
}

const SAFE_RENAMES = {
  'checked->isSelected': true,
  'defaultChecked->defaultSelected': true,
  'readonly->isReadOnly': true,
  'error->isInvalid': true,
  'required->isRequired': true,
  'hiddenLabel->isLabelHidden': true,
  'progress->isLoading': true,
  'visitable->allowVisited': true,
  'description->caption': true,
};

const CONTROLLED_PAIRS = [
  ['value', 'defaultValue', ['onChange']],
  ['isSelected', 'defaultSelected', ['onChange']],
  ['isOpen', 'defaultOpen', ['onOpenChange']],
  ['selectedKey', 'defaultSelectedKey', ['onSelectionChange']],
  ['selectedKeys', 'defaultSelectedKeys', ['onSelectionChange']],
  ['inputValue', 'defaultInputValue', ['onInputChange']],
  ['expandedKeys', 'defaultExpandedKeys', ['onExpandedChange']],
  ['isExpanded', 'defaultExpanded', ['onExpandedChange']],
];

const VALUE_CONTROLLED_EXTRA = new Set([
  'Calendar',
  'RangeCalendar',
  'Slider',
  'ButtonToggleGroup',
  'Tabs',
]);

const NO_HANDLER_NEEDED = ['isReadOnly', 'isDisabled'];

const PRESSABLE = new Set(['Button', 'IconButton', 'Link', 'SplitButton']);

const CHILD_LABELLED = new Set(['Checkbox', 'Toggle', 'Radio']);

const LABEL_PROPS = ['label', 'aria-label', 'aria-labelledby'];

const attrMap = (attrs) => new Map(attrs.map((attr) => [attr.name, attr]));

const isFalseLiteral = (attr) =>
  attr &&
  attr.kind === 'expression' &&
  /^(?:false|undefined|null)$/.test(String(attr.value).trim());

/**
 * JSX element decisions for a resolved Koobiq component. `fact`: { dsName,
 * attrs: [{ name, kind: 'literal'|'expression'|'boolean', value?, keys? }],
 * spread, hasChildren, textChildren }.
 */
export function checkElement(fact, ctx = {}) {
  const ds = ctx.knowledge?.ds;
  const results = [];
  const name = fact.dsName;

  if (!name) return results;

  const root = name.split('.')[0];
  const isRootElement = !name.includes('.');
  const attrs = attrMap(fact.attrs || []);
  const deprecated = ds?.deprecatedProps.get(root);

  if (ds && isRootElement && deprecated) {
    for (const attr of fact.attrs) {
      const info = deprecated.get(attr.name);

      if (info) {
        const safe =
          info.replacement &&
          (info.replacement === `is${capitalize(attr.name)}` ||
            SAFE_RENAMES[`${attr.name}->${info.replacement}`]);

        results.push(
          finding('deprecated/prop', `${root}: "${attr.name}" is deprecated.`, {
            attr: attr.name,
            suggestion: info.replacement
              ? `Use "${info.replacement}" instead.`
              : info.message,
            fixable: safe ? 'safe' : 'assisted',
            fix: info.replacement
              ? { kind: 'rename-prop', from: attr.name, to: info.replacement }
              : undefined,
            data: {
              component: root,
              prop: attr.name,
              replacement: info.replacement,
              source: info.source,
            },
          })
        );
      }

      if (attr.name === 'slotProps' && Array.isArray(attr.keys)) {
        for (const key of attr.keys) {
          const slot = deprecated.get(`slotProps.${key}`);

          if (slot) {
            results.push(
              finding(
                'deprecated/prop',
                `${root}: "slotProps.${key}" is deprecated.`,
                {
                  attr: 'slotProps',
                  suggestion: slot.message,
                  fixable: 'assisted',
                  data: { component: root, prop: `slotProps.${key}` },
                }
              )
            );
          }
        }
      }
    }
  }

  const enumProps = ds?.enums.get(root);

  if (enumProps && isRootElement) {
    for (const attr of fact.attrs) {
      const values = enumProps.get(attr.name);

      if (values && attr.kind === 'literal' && !values.includes(attr.value)) {
        results.push(
          finding(
            'props/invalid-value',
            `${root}: "${attr.value}" is not a valid value of "${attr.name}".`,
            {
              attr: attr.name,
              suggestion: `Allowed values: ${values.map((v) => `"${v}"`).join(', ')}.`,
            }
          )
        );
      }
    }
  }

  if (fact.spread || !isRootElement) return results;

  const controllable =
    ds?.fieldComponents.has(root) ||
    VALUE_CONTROLLED_EXTRA.has(root) ||
    CHILD_LABELLED.has(root);

  for (const [controlled, uncontrolled, handlers] of CONTROLLED_PAIRS) {
    const controlledAttr = attrs.get(controlled);

    if (!controlledAttr) continue;
    if (controlled === 'value' && !controllable) continue;

    if (attrs.has(uncontrolled)) {
      results.push(
        finding(
          'props/value-and-default',
          `${root}: both "${controlled}" and "${uncontrolled}" are set.`,
          {
            attr: uncontrolled,
            suggestion: `Keep "${controlled}" for a controlled component, or "${uncontrolled}" for an uncontrolled one.`,
          }
        )
      );
    }

    if (
      !isFalseLiteral(controlledAttr) &&
      !handlers.some((handler) => attrs.has(handler)) &&
      !NO_HANDLER_NEEDED.some(
        (prop) => attrs.has(prop) && !isFalseLiteral(attrs.get(prop))
      )
    ) {
      results.push(
        finding(
          'props/controlled-without-handler',
          `${root}: "${controlled}" is set without ${handlers.join(' / ')}.`,
          {
            attr: controlled,
            suggestion: `Handle ${handlers[0]}, use "${uncontrolled}" for an initial value, or mark the field isReadOnly.`,
            confidence: 'medium',
          }
        )
      );
    }
  }

  if (PRESSABLE.has(root) && attrs.has('onClick') && !attrs.has('onPress')) {
    results.push(
      finding('props/onclick', `${root}: use onPress instead of onClick.`, {
        attr: 'onClick',
        suggestion:
          'onPress handles mouse, touch and keyboard consistently (React Aria press events).',
        fixable: 'assisted',
      })
    );
  }

  const hasName = (props) =>
    props.some((prop) => attrs.has(prop) && !isFalseLiteral(attrs.get(prop)));

  if (root === 'IconButton' && !hasName(['aria-label', 'aria-labelledby'])) {
    results.push(
      finding(
        'a11y/icon-button-label',
        'IconButton has no aria-label or aria-labelledby.',
        {
          suggestion: 'Describe the action: aria-label="Delete row".',
        }
      )
    );
  }

  if (
    root === 'Button' &&
    attrs.has('onlyIcon') &&
    !isFalseLiteral(attrs.get('onlyIcon')) &&
    !fact.textChildren &&
    !hasName(['aria-label', 'aria-labelledby'])
  ) {
    results.push(
      finding(
        'a11y/icon-button-label',
        'Icon-only Button has no accessible name.',
        {
          suggestion: 'Add aria-label, or use IconButton with aria-label.',
        }
      )
    );
  }

  if (ds?.fieldComponents.has(root) && !hasName(LABEL_PROPS)) {
    results.push(
      finding(
        'a11y/field-label',
        `${root} has no label, aria-label or aria-labelledby.`,
        {
          suggestion:
            'Add a visible label, or aria-label when the label is hidden. A placeholder is not a label.',
        }
      )
    );
  }

  if (
    CHILD_LABELLED.has(root) &&
    !fact.hasChildren &&
    !hasName(['aria-label', 'aria-labelledby'])
  ) {
    results.push(
      finding('a11y/field-label', `${root} has no text and no aria-label.`, {
        suggestion: `Pass the label as children: <${root}>Label</${root}>.`,
      })
    );
  }

  return results;
}

const RAW_ELEMENTS = {
  button: { severity: 'warning', target: ['Button', 'IconButton'] },
  select: { severity: 'warning', target: ['SelectNext'] },
  textarea: { severity: 'warning', target: ['Textarea'] },
  input: { severity: 'warning', target: ['Input'] },
  a: { severity: 'info', target: ['Link'] },
  hr: { severity: 'info', target: ['Divider'] },
  table: { severity: 'info', target: ['Table'] },
  dialog: { severity: 'info', target: ['Modal'] },
  progress: { severity: 'info', target: ['ProgressBar'] },
  details: { severity: 'info', target: ['Accordion'] },
};

const INPUT_TYPES = {
  number: 'InputNumber',
  search: 'SearchInput',
  checkbox: 'Checkbox',
  radio: 'RadioGroup',
  date: 'DatePicker',
  'datetime-local': 'DatePicker',
  time: 'TimePicker',
  file: 'FileTrigger',
};

const INPUT_SKIP = new Set([
  'hidden',
  'submit',
  'reset',
  'image',
  'color',
  'range',
  'button',
]);

/** Raw intrinsic elements that have a Koobiq equivalent. */
export function checkRawElement(fact, ctx = {}) {
  const ds = ctx.knowledge?.ds;
  const config = RAW_ELEMENTS[fact.tag];

  if (!config) return [];

  const attrs = attrMap(fact.attrs || []);

  if (fact.tag === 'a' && !attrs.has('href')) return [];

  let targets = config.target;

  if (fact.tag === 'input') {
    const type = attrs.get('type');

    const typeValue =
      type?.kind === 'literal' ? String(type.value).toLowerCase() : 'text';

    if (INPUT_SKIP.has(typeValue)) return [];
    targets = [INPUT_TYPES[typeValue] || 'Input'];
    if (typeValue === 'file') targets = ['FileTrigger', 'FileUpload'];
  }

  const available = ds ? targets.filter((t) => ds.exportIndex.has(t)) : targets;

  if (ds && available.length === 0) return [];

  const allowed = ctx.config?.rawElements;

  if (Array.isArray(allowed) && allowed.includes(fact.tag)) return [];

  return [
    finding(
      'component/raw-element',
      `Raw <${fact.tag}> where Koobiq has ${available.join(' / ')}.`,
      {
        severity: config.severity,
        suggestion: `Use ${available.join(' or ')} from "${DS_PACKAGE}".`,
        confidence: config.severity === 'warning' ? 'high' : 'medium',
        fixable: 'assisted',
        data: { tag: fact.tag, targets: available },
      }
    ),
  ];
}

/** Token-set membership helpers for a product package. */
export function tokenSetsFor(knowledge, tokenSet) {
  const tokens = knowledge?.tokens;

  if (!tokens) return null;

  const active =
    tokenSet === 'legacy'
      ? [tokens.sets.legacy]
      : tokenSet === 'new'
        ? [tokens.sets.new]
        : [tokens.sets.new, tokens.sets.legacy];

  return { active, newSet: tokens.sets.new, legacy: tokens.sets.legacy };
}

const lookupToken = (sets, name) => {
  for (const set of sets) {
    if (set.has(name)) return set.get(name);
  }

  return null;
};

/**
 * Token reference decisions. `fact`: { name } or { dynamicPrefix }, plus
 * `hasFallback`. ctx: { knowledge, tokenSet, productDefined: Set }.
 */
export function checkTokenRef(fact, ctx = {}) {
  const { knowledge = {}, tokenSet = 'none', productDefined = new Set() } = ctx;
  const sets = tokenSetsFor(knowledge, tokenSet);

  if (!sets) return [];

  const styles = knowledge.ds?.styles;

  const isKnownElsewhere = (name) =>
    productDefined.has(name) ||
    styles?.defined.has(name) ||
    styles?.read.has(name);

  if (fact.dynamicPrefix) {
    const prefix = fact.dynamicPrefix;

    const any = [...sets.newSet.keys(), ...sets.legacy.keys()].some((n) =>
      n.startsWith(prefix)
    );

    return any || isKnownElsewhere(prefix)
      ? []
      : [
          finding('token/unknown', `No token starts with "${prefix}".`, {
            confidence: 'medium',
            severity: 'warning',
          }),
        ];
  }

  const name = fact.name;
  const info = lookupToken(sets.active, name);

  if (!info) {
    if (isKnownElsewhere(name)) return [];

    const inLegacy = sets.legacy.has(name);
    const inNew = sets.newSet.has(name);

    const close = closestNames(
      name,
      (tokenSet === 'legacy' ? sets.legacy : sets.newSet).keys()
    );

    let suggestion = close.length
      ? `Did you mean ${close.join(', ')}?`
      : undefined;

    if (inLegacy && !inNew)
      suggestion =
        `"${name}" exists only in the legacy token set. ${suggestion || ''}`.trim();
    if (inNew && !inLegacy)
      suggestion = `"${name}" exists only in the web/new token set; switch the app to web/new.`;

    return [
      finding(
        'token/unknown',
        `"${name}" is not defined by the installed design tokens or the DS.`,
        {
          severity: fact.hasFallback ? 'warning' : 'error',
          suggestion,
          data: { name, inLegacy, inNew, closest: close },
        }
      ),
    ];
  }

  const results = [];

  if (info.deprecated) {
    results.push(
      finding('token/deprecated', `"${name}" is deprecated.`, {
        suggestion: info.deprecated,
        data: { name },
      })
    );
  }

  if (tokenSet !== 'new' && sets.legacy.has(name) && !sets.newSet.has(name)) {
    results.push(
      finding(
        'token/legacy-only',
        `"${name}" exists only in the legacy token set.`,
        {
          suggestion:
            'Migrate to a web/new token before switching the token stylesheets.',
          data: { name },
        }
      )
    );
  }

  return results;
}

/** Product definitions of --kbq-* custom properties. */
export function checkTokenDef(fact, ctx = {}) {
  const { knowledge = {} } = ctx;
  const tokens = knowledge.tokens;
  const styles = knowledge.ds?.styles;

  if (!tokens || !styles) return [];

  const name = fact.name;
  const isToken = tokens.sets.new.has(name) || tokens.sets.legacy.has(name);

  if (styles.overridePoints.has(name) || styles.defined.has(name)) return [];

  if (isToken) {
    return ctx.vendored
      ? []
      : [
          finding(
            'token/overrides-token',
            `The product redefines the design token "${name}".`,
            {
              suggestion:
                'Prefer component override variables (--kbq-<component>-*) or props over redefining tokens.',
              confidence: 'medium',
            }
          ),
        ];
  }

  const close = closestNames(name, styles.overridePoints, 2);

  return [
    finding(
      'token/defines-unknown-public-var',
      `"${name}" is neither a design token nor a Koobiq override point.`,
      {
        suggestion: close.length
          ? `Did you mean ${close.join(', ')}? Product variables should not use the --kbq- prefix.`
          : 'Product variables should not use the --kbq- prefix.',
      }
    ),
  ];
}

const HASHED_IN_TEXT_RE =
  /(?<![\w-])kbq-[a-z0-9]+(?:-[A-Za-z0-9_]+)*-[0-9a-f]{6}(?![\w-])/g;

const CLASS_ATTR_RE = /\[\s*class\s*[*^$|~]?=\s*["']?\s*kbq-/;
const DS_GLOBAL_RE = /(?<![\w-])\.?kbq-Tree[A-Za-z]*\b/;

/** Hashed or internal Koobiq classes in a selector or a string. */
export function checkClassReferences(
  text,
  ctx = {},
  { inSelector = true } = {}
) {
  const styles = ctx.knowledge?.ds?.styles;
  const results = [];

  for (const match of String(text).matchAll(HASHED_IN_TEXT_RE)) {
    const name = match[0];

    if (name === 'kbq-light' || name === 'kbq-dark') continue;

    let confidence = 'low';

    if (styles?.hashedClasses.has(name)) confidence = 'high';
    else if (styles?.filePrefixes.has(name.split('-')[1]))
      confidence = 'medium';
    else if (!styles && inSelector) confidence = 'medium';

    if (confidence === 'low') continue;

    results.push(
      finding(
        'style/hashed-class',
        `"${name}" is a hashed Koobiq CSS-module class, not public API.`,
        {
          confidence,
          index: match.index,
          suggestion:
            'Style through props, className on the component, data-* attributes (data-slot, data-variant) or --kbq-<component>-* override variables.',
          data: { className: name, stale: confidence === 'medium' },
        }
      )
    );
  }

  if (inSelector && CLASS_ATTR_RE.test(text)) {
    results.push(
      finding(
        'style/hashed-class',
        'Attribute selector matches Koobiq hashed classes ([class*="kbq-"]).',
        {
          suggestion: 'Use data-* attributes or override variables instead.',
        }
      )
    );
  }

  if (inSelector && DS_GLOBAL_RE.test(text)) {
    results.push(
      finding(
        'style/ds-global-class',
        'The selector targets an internal global Koobiq class (kbq-Tree*).',
        {
          confidence: 'medium',
        }
      )
    );
  }

  return results;
}

const COLOR_PROPS =
  /^(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?(?:-color)?|outline(?:-color)?|fill|stroke|caret-color|text-decoration-color|column-rule-color|box-shadow|text-shadow)$/i;

const SKIP_COLOR_VALUES =
  /^(?:transparent|currentcolor|inherit|initial|unset|none|revert)$/i;

const DS_TARGET_SELECTOR = /\[data-(?:slot|variant)|\.kbq-|\[class[*^]?=/;

/**
 * Declaration decisions. `fact`: { prop, value, important, selector,
 * inThemeBlock }.
 */
export function checkDeclaration(fact, ctx = {}) {
  const { knowledge = {} } = ctx;
  const results = [];
  const prop = String(fact.prop).toLowerCase();
  const value = String(fact.value ?? '');

  if (
    fact.important &&
    fact.selector &&
    DS_TARGET_SELECTOR.test(fact.selector)
  ) {
    results.push(
      finding(
        'style/important-on-ds',
        '!important overrides Koobiq component styles.',
        {
          suggestion:
            'Use override variables (--kbq-<component>-*), slotProps or a className on the component.',
        }
      )
    );
  }

  if (prop.startsWith('--')) return results;

  if (
    COLOR_PROPS.test(prop) &&
    !SKIP_COLOR_VALUES.test(value.trim()) &&
    !fact.inThemeBlock
  ) {
    const family = propertyFamily(prop);

    for (const { literal } of findColorLiterals(value)) {
      const key = colorKey(parseColor(literal));

      const matches = (knowledge.tokens?.colorIndex.get(key) || [])
        .slice()
        .sort(
          (a, b) =>
            Number(tokenFamily(b.name) === family) -
              Number(tokenFamily(a.name) === family) ||
            Number(b.theme === 'light') - Number(a.theme === 'light')
        );

      const inFamily = matches.filter((m) => tokenFamily(m.name) === family);

      const names = [
        ...new Set((inFamily.length ? inFamily : matches).map((m) => m.name)),
      ].slice(0, 3);

      results.push(
        finding(
          'style/hardcoded-color',
          `Literal color ${literal} in "${prop}"; it will not follow the light/dark theme.`,
          {
            severity: inFamily.length ? 'warning' : 'info',
            confidence: inFamily.length ? 'high' : 'medium',
            suggestion: names.length
              ? `Matching tokens: ${names.map((n) => `var(${n})`).join(', ')}.`
              : `Use a semantic ${family === 'other' ? '' : `${family} `}token (var(--kbq-…)) that exists in both themes.`,
            fixable: names.length === 1 ? 'assisted' : 'manual',
            data: { literal, family, tokens: names },
          }
        )
      );
    }
  }

  if (prop === 'z-index' && /^-?\d+$/.test(value.trim())) {
    const n = Number(value.trim());

    if (n >= 950) {
      results.push(
        finding(
          'style/hardcoded-z-index',
          `z-index: ${n} competes with the Koobiq layer scale.`,
          {
            suggestion:
              'Use var(--kbq-layer-topbar | --kbq-layer-modal | --kbq-layer-toast) or keep local stacking below 950.',
            confidence: 'medium',
          }
        )
      );
    }
  }

  if (
    ctx.rules?.['style/hardcoded-spacing'] &&
    /^(?:margin|padding|gap|row-gap|column-gap|inset)/.test(prop) &&
    knowledge.tokens
  ) {
    for (const match of value.matchAll(/\b(\d+)px\b/g)) {
      const names = knowledge.tokens.sizes.get(`${match[1]}px`);

      if (names?.length && match[1] !== '0') {
        results.push(
          finding(
            'style/hardcoded-spacing',
            `${match[0]} equals ${names[0]}.`,
            {
              suggestion: `var(${names[0]})`,
              confidence: 'medium',
            }
          )
        );
      }
    }
  }

  return results;
}

/** Static SCSS token variables ($light-*, $dark-*). */
export function checkScssVariable(name) {
  if (!/^\$(?:light|dark)-[a-z0-9-]+$/.test(name)) return [];

  return [
    finding(
      'token/scss-static-variable',
      `${name} is a static token value; it never switches theme.`,
      {
        suggestion: `Use var(--kbq-${name.replace(/^\$(?:light|dark)-/, '')}).`,
      }
    ),
  ];
}

/** Severity of a finding after rule defaults and overrides. */
export function resolveSeverity(found, overrides = {}) {
  const override = overrides[found.id];

  if (override) return override;

  return found.severity || RULES[found.id]?.severity || 'warning';
}

export const isRuleEnabled = (id, overrides = {}) => {
  if (overrides[id] === 'off') return false;
  if (overrides[id]) return true;

  return RULES[id]?.defaultEnabled !== false;
};
