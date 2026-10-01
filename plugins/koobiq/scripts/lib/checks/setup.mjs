import fs from 'node:fs';
import path from 'node:path';

import {
  DS_PACKAGE,
  ICONS_PACKAGE,
  INTERNAL_PACKAGES,
  PRESET_VERSION,
  TOKENS_PACKAGE,
  findPackageDir,
} from '../../../lint/koobiq-core.mjs';
import { readJsonFile, sha256 } from '../util.mjs';

const parseVersion = (v) => {
  const m = String(v).match(/(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?/);

  return m
    ? [m[1], m[2], m[3]].map((p) =>
        p == null || p === 'x' || p === '*' ? null : Number(p)
      )
    : null;
};

const compare = (a, b) => {
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);

    if (diff) return diff;
  }

  return 0;
};

const satisfiesComparator = (version, comparator) => {
  const c = comparator.trim();

  if (!c || c === '*' || c === 'x' || c === 'latest') return true;

  const m = c.match(/^(\^|~|>=|<=|>|<|=)?\s*v?(.+)$/);

  if (!m) return true;

  const range = parseVersion(m[2]);
  const v = parseVersion(version);

  if (!range || !v) return true;

  const [major, minor, patch] = range;

  switch (m[1]) {
    case '^':
      if (compare(v, range) < 0) return false;
      if (major > 0) return v[0] === major;
      if ((minor ?? 0) > 0) return v[0] === 0 && v[1] === minor;

      return v[0] === 0 && v[1] === 0 && (patch == null || v[2] === patch);
    case '~':
      return (
        compare(v, range) >= 0 &&
        v[0] === major &&
        (minor == null || v[1] === minor)
      );
    case '>=':
      return compare(v, range) >= 0;
    case '>':
      return compare(v, range) > 0;
    case '<=':
      return compare(v, range) <= 0;
    case '<':
      return compare(v, range) < 0;
    default:
      return (
        v[0] === major &&
        (minor == null || v[1] === minor) &&
        (patch == null || v[2] === patch)
      );
  }
};

/** Minimal semver range check (^, ~, comparisons, x-ranges, ||). */
export function satisfies(version, range) {
  if (
    !range ||
    /^(?:workspace|file|link|portal|npm|git|github|http)/.test(range)
  )
    return true;

  return range.split('||').some((set) =>
    set
      .trim()
      .replace(/\s+-\s+/, ' ')
      .split(/\s+/)
      .every((comparator) => satisfiesComparator(version, comparator))
  );
}

const PRESET_HEADER_RE =
  /^\/\/ @koobiq\/lint-preset file=(\S+) preset=(\S+) generated=(\S+) sha256=([0-9a-f]+)\r?\n/;

const finding = (id, message, file, line, extra = {}) => ({
  id,
  message,
  file,
  line,
  column: 1,
  confidence: 'high',
  ...extra,
});

const packageJsonLine = (pkg, name) => {
  try {
    const text = fs.readFileSync(path.join(pkg.abs, 'package.json'), 'utf8');
    const index = text.indexOf(`"${name}"`);

    return index === -1 ? 1 : text.slice(0, index).split('\n').length;
  } catch {
    return 1;
  }
};

const pkgFile = (pkg) =>
  pkg.dir === '.' ? 'package.json' : `${pkg.dir}/package.json`;

/** Project-level setup findings for one package. */
export function checkPackageSetup(pkg, { root, config = {} }) {
  const findings = [];
  const index = pkg.index;
  const ds = pkg.knowledge?.ds;
  const externalTokens = config.setup?.tokensProvidedExternally === true;

  // Lint preset drift applies to any package with copied preset files.
  for (const rel of index.presetFiles) {
    try {
      const text = fs.readFileSync(path.join(root, rel), 'utf8');
      const header = text.match(PRESET_HEADER_RE);

      if (!header) continue;

      const body = text.slice(header[0].length);

      if (sha256(body) !== header[4]) {
        findings.push(
          finding(
            'setup/lint-preset-modified',
            `${rel} was edited after /koobiq:setup-lint copied it.`,
            rel,
            1,
            {
              suggestion:
                'Move local tweaks into the product lint config, then re-run /koobiq:setup-lint.',
            }
          )
        );
      } else if (Number(header[2]) < Number(PRESET_VERSION)) {
        findings.push(
          finding(
            'setup/lint-preset-outdated',
            `${rel} is preset v${header[2]}; the plugin ships v${PRESET_VERSION}.`,
            rel,
            1,
            {
              suggestion:
                'Re-run /koobiq:setup-lint to update the copied preset.',
            }
          )
        );
      }
    } catch {
      // unreadable preset file: nothing to report
    }
  }

  if (!pkg.usesDs) return findings;

  const entry = pkg.entry;

  // Internal Koobiq packages declared by the product.
  for (const name of INTERNAL_PACKAGES) {
    const range = pkg.deps[name];

    if (!range) continue;

    const pinned = ds?.dependencies?.[name];

    const skew =
      pinned &&
      !/^workspace:/.test(pinned) &&
      !satisfies(pinned.replace(/^[\^~]/, ''), range);

    findings.push(
      finding(
        skew ? 'setup/ds-version-skew' : 'import/direct-core-dependency',
        skew
          ? `${name}@${range} does not match ${pinned} that ${DS_PACKAGE}@${ds.version} uses.`
          : `${name} is an internal Koobiq package; ${DS_PACKAGE} already brings it.`,
        pkgFile(pkg),
        packageJsonLine(pkg, name),
        {
          suggestion: skew
            ? `Remove ${name} from package.json or align it with ${pinned}.`
            : `Remove ${name} from package.json and import public APIs from ${DS_PACKAGE}.`,
        }
      )
    );
  }

  // Duplicate installs of internal packages.
  if (ds) {
    for (const name of ['@koobiq/react-core', '@koobiq/react-primitives']) {
      const fromProduct = findPackageDir(pkg.abs, name);
      const fromDs = findPackageDir(ds.dir, name);

      if (fromProduct && fromDs && fromProduct !== fromDs) {
        const a = readJsonFile(path.join(fromProduct, 'package.json'))?.version;
        const b = readJsonFile(path.join(fromDs, 'package.json'))?.version;

        if (a && b && a !== b) {
          findings.push(
            finding(
              'setup/duplicate-ds-packages',
              `${name} is installed twice (${a} and ${b}).`,
              pkgFile(pkg),
              1,
              {
                suggestion:
                  'Deduplicate (remove the direct dependency, then reinstall) so contexts and providers come from one copy.',
              }
            )
          );
        }
      }
    }
  }

  // Peer dependencies of the DS (apps provide them; libraries get them
  // from the app).
  for (const name of [TOKENS_PACKAGE, ICONS_PACKAGE]) {
    if (pkg.isApp && !pkg.declared[name]) {
      findings.push(
        finding(
          'setup/missing-peer-dependency',
          `${name} is a peer dependency of ${DS_PACKAGE} but is not declared.`,
          pkgFile(pkg),
          1,
          {
            suggestion: `Add ${name} to dependencies${ds?.peerDependencies?.[name] ? ` (${ds.peerDependencies[name]})` : ''}.`,
          }
        )
      );
    }
  }

  // Optional peers of /markdown and /code-block.
  if (ds) {
    for (const imp of index.dsImports.filter((i) => i.entry)) {
      const peers = ds.optionalPeers.get(`.${imp.entry}`) || [];

      const missing = peers.filter(
        (peer) => !pkg.declared[peer] && !findPackageDir(pkg.abs, peer)
      );

      if (missing.length) {
        findings.push(
          finding(
            'setup/missing-optional-peer',
            `${DS_PACKAGE}${imp.entry} needs ${missing.join(', ')}.`,
            imp.file,
            imp.line,
            {
              suggestion: `Install ${missing.join(' ')}.`,
            }
          )
        );
      }
    }
  }

  if (!pkg.isApp) return findings;

  // Design tokens.
  const tokenImports = index.tokenImports;

  const legacy = tokenImports.filter(
    (i) => i.set === 'legacy' && i.which !== 'other'
  );

  const modern = tokenImports.filter(
    (i) => i.set === 'new' && i.which !== 'other'
  );

  const legacyByFile = new Map();

  for (const imp of legacy) {
    if (!legacyByFile.has(imp.file)) legacyByFile.set(imp.file, []);
    legacyByFile.get(imp.file).push(imp);
  }

  for (const [file, imps] of legacyByFile) {
    findings.push(
      finding(
        'setup/legacy-token-set',
        'Design tokens are imported from the legacy web/css-tokens*.css set.',
        file,
        imps[0].line,
        {
          suggestion:
            'Import @koobiq/design-tokens/web/new/css-tokens.css, web/new/css-tokens-light.css and web/new/css-tokens-dark.css instead (before @koobiq/react-components/style.css).',
          fixable: 'safe',
          fix: {
            kind: 'replace-token-imports',
            lines: imps.map((i) => i.line),
          },
          data: {
            lines: imps.map((i) => i.line),
            files: imps.map((i) => i.path),
          },
        }
      )
    );
  }

  if (legacy.length && modern.length) {
    findings.push(
      finding(
        'setup/mixed-token-sets',
        'Both the legacy and the web/new token sets are imported.',
        legacy[0].file,
        legacy[0].line,
        {
          suggestion: 'Keep only the web/new token stylesheets.',
        }
      )
    );
  }

  if (!externalTokens) {
    const hasBase = tokenImports.some((i) => i.which === 'base');

    if (!hasBase) {
      findings.push(
        finding(
          'setup/missing-tokens',
          'The app never imports @koobiq/design-tokens stylesheets.',
          entry,
          1,
          {
            suggestion:
              "Import '@koobiq/design-tokens/web/new/css-tokens.css', '…/css-tokens-light.css' and '…/css-tokens-dark.css' before '@koobiq/react-components/style.css'.",
          }
        )
      );
    } else {
      const usesDark = index.themeClassUses.length > 0;

      for (const theme of ['light', 'dark']) {
        if (usesDark && !tokenImports.some((i) => i.which === theme)) {
          findings.push(
            finding(
              'setup/missing-tokens',
              `kbq-${theme} is never defined: css-tokens-${theme}.css is not imported.`,
              tokenImports[0].file,
              tokenImports[0].line,
              {
                suggestion: `Import '@koobiq/design-tokens/web/new/css-tokens-${theme}.css'.`,
              }
            )
          );
        }
      }
    }
  }

  if (!index.styleCssImports.length) {
    findings.push(
      finding(
        'setup/missing-style-css',
        `${DS_PACKAGE}/style.css is never imported.`,
        entry,
        1,
        {
          suggestion: `Import '${DS_PACKAGE}/style.css' once in the app entry, after the token stylesheets.`,
        }
      )
    );
  } else {
    for (const css of index.styleCssImports) {
      const sameFileTokens = tokenImports.filter((i) => i.file === css.file);

      if (sameFileTokens.some((t) => t.line > css.line)) {
        findings.push(
          finding(
            'setup/style-css-order',
            'Component styles are imported before the design tokens.',
            css.file,
            css.line,
            {
              suggestion: 'Move the token imports above the style.css import.',
              fixable: 'safe',
            }
          )
        );
      }
    }
  }

  if (!index.providerUses.length) {
    findings.push(
      finding(
        'setup/no-provider',
        `The app never renders <Provider> from ${DS_PACKAGE}.`,
        entry,
        1,
        {
          suggestion:
            'Wrap the app root in <Provider> (locale, router, breakpoints).',
          confidence: 'medium',
        }
      )
    );
  } else {
    if (
      pkg.hasRouter &&
      index.linkHrefUses > 0 &&
      index.providerUses.every((use) => !use.hasRouter)
    ) {
      const use = index.providerUses[0];

      findings.push(
        finding(
          'setup/provider-without-router',
          'A client-side router is used but <Provider> gets no router.',
          use.file,
          use.line,
          {
            suggestion:
              'Pass router={{ navigate, useHref }} so Koobiq links navigate client-side.',
            confidence: 'medium',
          }
        )
      );
    }

    if (pkg.hasI18n && index.providerUses.every((use) => !use.hasLocale)) {
      const use = index.providerUses[0];

      findings.push(
        finding(
          'i18n/provider-without-locale',
          '<Provider> gets no locale although the app is localized.',
          use.file,
          use.line,
          {
            suggestion:
              'Pass the current app locale: <Provider locale={locale}>.',
            confidence: 'medium',
          }
        )
      );
    }
  }

  if (!index.themeClassUses.length) {
    findings.push(
      finding(
        'setup/no-theme-class',
        'No element gets the kbq-light / kbq-dark theme class.',
        entry,
        1,
        {
          suggestion:
            'Set class="kbq-light" (or kbq-dark) on <html> or <body>; with next-themes use themes={["kbq-light", "kbq-dark"]}.',
          confidence: 'medium',
        }
      )
    );
  }

  if (index.toastUses.length && !index.toastProviderUses.length) {
    const use = index.toastUses[0];

    findings.push(
      finding(
        'setup/no-toast-provider',
        'toast is called but <ToastProvider> is never rendered.',
        use.file,
        use.line,
        {
          suggestion: 'Render <ToastProvider /> once near the app root.',
        }
      )
    );
  }

  if (!index.fonts) {
    findings.push(
      finding(
        'setup/missing-fonts',
        'Inter / JetBrains Mono are not loaded.',
        entry,
        1,
        {
          suggestion:
            'Load the fonts (e.g. @fontsource/inter and @fontsource/jetbrains-mono) — see the Fonts page.',
          confidence: 'medium',
        }
      )
    );
  }

  for (const rel of index.vendoredFiles) {
    findings.push(
      finding(
        'setup/vendored-tokens',
        `${rel} redefines hundreds of design tokens.`,
        rel,
        1,
        {
          suggestion:
            'Import the @koobiq/design-tokens stylesheets instead of copying them.',
        }
      )
    );
  }

  return findings;
}
