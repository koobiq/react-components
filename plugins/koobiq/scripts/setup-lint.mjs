#!/usr/bin/env node
// Plans (and with --apply performs) the installation of the Koobiq lint
// preset into a product: copies the preset files into <root>/.koobiq/ with a
// version header, creates missing config files and prints the exact config
// edits and install commands the /koobiq:setup-lint skill applies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PRESET_VERSION } from '../lint/koobiq-core.mjs';

import { git, sha256 } from './lib/util.mjs';

const PLUGIN_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const LINT_DIR = path.join(PLUGIN_ROOT, 'lint');

const HEADER_RE =
  /^\/\/ @koobiq\/lint-preset file=(\S+) preset=(\S+) generated=(\S+) sha256=([0-9a-f]+)\r?\n/;

const ESLINT_FLAT = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
];

const ESLINT_LEGACY = [
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml',
];

const STYLELINT_CONFIGS = [
  'stylelint.config.js',
  'stylelint.config.mjs',
  'stylelint.config.cjs',
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.js',
  '.stylelintrc.cjs',
  '.stylelintrc.mjs',
  '.stylelintrc.yml',
  '.stylelintrc.yaml',
];

const DEFAULT_CHECK_CONFIG = {
  ignore: [],
  rules: {},
  uiKits: { allow: [] },
  icons: { allow: [] },
  rawElements: [],
  setup: {},
};

const read = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const majorOf = (version) =>
  Number(
    String(version || '')
      .replace(/^[^\d]*/, '')
      .split('.')[0]
  ) || null;

const installedVersion = (root, name) => {
  let dir = root;

  for (;;) {
    const pkg = readJson(
      path.join(dir, 'node_modules', ...name.split('/'), 'package.json')
    );

    if (pkg?.version) return pkg.version;

    const parent = path.dirname(dir);

    if (parent === dir) return null;
    dir = parent;
  }
};

/** pnpm / npm / yarn / bun, from packageManager or the nearest lockfile. */
export function detectPackageManager(root) {
  const stop = git(['rev-parse', '--show-toplevel'], root)?.trim();
  let dir = root;

  for (;;) {
    const pkg = readJson(path.join(dir, 'package.json'));

    if (pkg?.packageManager) return pkg.packageManager.split('@')[0];
    if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn';
    if (
      fs.existsSync(path.join(dir, 'bun.lockb')) ||
      fs.existsSync(path.join(dir, 'bun.lock'))
    )
      return 'bun';
    if (fs.existsSync(path.join(dir, 'package-lock.json'))) return 'npm';

    const parent = path.dirname(dir);

    if (parent === dir || (stop && path.resolve(dir) === path.resolve(stop)))
      return 'npm';
    dir = parent;
  }
}

export const installCommand = (manager, packages) => {
  if (!packages.length) return null;

  const list = packages.join(' ');

  switch (manager) {
    case 'pnpm':
      return `pnpm add -D ${list}`;
    case 'yarn':
      return `yarn add -D ${list}`;
    case 'bun':
      return `bun add -d ${list}`;
    default:
      return `npm install -D ${list}`;
  }
};

const hasStyleFiles = (root) => {
  const listed = git(
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    root
  );

  const files = listed
    ? listed.split('\0')
    : (() => {
        try {
          return fs.readdirSync(root, { recursive: true }).map(String);
        } catch {
          return [];
        }
      })();

  const kinds = new Set();

  for (const file of files) {
    if (/node_modules|[\\/]dist[\\/]/.test(file)) continue;

    const match = file.match(/\.(css|scss|less)$/);

    if (match) kinds.add(match[1]);
  }

  return kinds;
};

/** What lint tooling the product has. */
export function detect(root) {
  const pkg = readJson(path.join(root, 'package.json')) || {};
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const flat = ESLINT_FLAT.find((f) => fs.existsSync(path.join(root, f)));

  const legacy =
    ESLINT_LEGACY.find((f) => fs.existsSync(path.join(root, f))) ||
    (pkg.eslintConfig ? 'package.json#eslintConfig' : null);

  const stylelintConfig =
    STYLELINT_CONFIGS.find((f) => fs.existsSync(path.join(root, f))) ||
    (pkg.stylelint ? 'package.json#stylelint' : null);

  const eslintText = flat ? read(path.join(root, flat)) || '' : '';

  return {
    packageManager: detectPackageManager(root),
    typescript: Boolean(deps.typescript),
    eslint: {
      config: flat || legacy || null,
      style: flat ? 'flat' : legacy ? 'legacy' : 'none',
      version: installedVersion(root, 'eslint') || deps.eslint || null,
      next: Boolean(deps['eslint-config-next']),
      typed: /projectService|parserOptions[\s\S]{0,200}project\s*:/.test(
        eslintText
      ),
      wired: eslintText.includes('.koobiq/eslint.koobiq.mjs'),
    },
    stylelint: {
      config: stylelintConfig,
      version: installedVersion(root, 'stylelint') || deps.stylelint || null,
      wired: stylelintConfig
        ? (read(path.join(root, stylelintConfig)) || '').includes(
            '.koobiq/stylelint.koobiq.mjs'
          )
        : false,
    },
    styles: [...hasStyleFiles(root)],
    prettier:
      Boolean(deps.prettier) ||
      fs.existsSync(path.join(root, '.prettierrc')) ||
      fs.existsSync(path.join(root, '.prettierignore')),
    prettierIgnored: (read(path.join(root, '.prettierignore')) || '')
      .split(/\r?\n/)
      .some((l) => l.trim().replace(/\/$/, '') === '.koobiq'),
  };
}

const withHeader = (name, body, date) =>
  `// @koobiq/lint-preset file=${name} preset=${PRESET_VERSION} generated=${date} sha256=${sha256(body)}\n${body}`;

/** Status of one preset file in the product. */
export function fileStatus(target, body) {
  const current = read(target);

  if (current == null) return 'create';

  const header = current.match(HEADER_RE);

  if (!header) return 'modified';

  const currentBody = current.slice(header[0].length);

  if (sha256(currentBody) !== header[4]) return 'modified';
  if (currentBody === body) return 'unchanged';

  return 'update';
}

const ESLINT_CONFIG = `import koobiq from './.koobiq/eslint.koobiq.mjs';

export default [
  { ignores: ['dist/**', 'build/**', '.next/**', 'coverage/**'] },
  ...koobiq,
];
`;

const ESLINT_TS_CONFIG = `import tseslint from 'typescript-eslint';

import koobiq from './.koobiq/eslint.koobiq.mjs';

export default tseslint.config(
  { ignores: ['dist/**', 'build/**', '.next/**', 'coverage/**'] },
  ...tseslint.configs.recommended,
  ...koobiq
);
`;

const stylelintConfig = (styles) => {
  const overrides = [];

  if (styles.includes('scss'))
    overrides.push(
      "    { files: ['**/*.scss'], customSyntax: 'postcss-scss' },"
    );
  if (styles.includes('less'))
    overrides.push(
      "    { files: ['**/*.less'], customSyntax: 'postcss-less' },"
    );

  return [
    'export default {',
    "  extends: ['./.koobiq/stylelint.koobiq.mjs'],",
    ...(overrides.length ? ['  overrides: [', ...overrides, '  ],'] : []),
    '};',
    '',
  ].join('\n');
};

export function planSetup({
  root,
  eslintOnly = false,
  stylelintOnly = false,
  force = false,
}) {
  const tooling = detect(root);
  const date = new Date().toISOString().slice(0, 10);
  const wantEslint = !stylelintOnly && tooling.eslint.style !== 'legacy';

  const wantStylelint =
    !eslintOnly &&
    tooling.styles.length > 0 &&
    (!tooling.stylelint.version || majorOf(tooling.stylelint.version) >= 16);

  const names = [
    'koobiq-core.mjs',
    ...(wantEslint ? ['eslint.koobiq.mjs'] : []),
    ...(wantStylelint ? ['stylelint.koobiq.mjs'] : []),
  ];

  const files = names.map((name) => {
    const body = read(path.join(LINT_DIR, name));
    const target = path.join(root, '.koobiq', name);
    const status = fileStatus(target, body);

    return {
      file: `.koobiq/${name}`,
      status,
      write:
        status === 'create' ||
        status === 'update' ||
        (status === 'modified' && force),
      content: withHeader(name, body, date),
    };
  });

  const checkJson = path.join(root, '.koobiq', 'check.json');

  if (!fs.existsSync(checkJson)) {
    files.push({
      file: '.koobiq/check.json',
      status: 'create',
      write: true,
      content: `${JSON.stringify(DEFAULT_CHECK_CONFIG, null, 2)}\n`,
    });
  }

  const devDependencies = [];
  const edits = [];
  const notes = [];

  if (!stylelintOnly) {
    if (tooling.eslint.style === 'legacy') {
      notes.push(
        `ESLint uses a legacy config (${tooling.eslint.config}). The Koobiq preset needs flat config: migrate with "npx @eslint/migrate-config ${tooling.eslint.config.replace('package.json#eslintConfig', 'package.json')}", then re-run /koobiq:setup-lint.`
      );
    } else if (tooling.eslint.style === 'none') {
      devDependencies.push(
        'eslint',
        ...(tooling.typescript ? ['typescript-eslint'] : [])
      );

      files.push({
        file: 'eslint.config.mjs',
        status: 'create',
        write: true,
        content: tooling.typescript ? ESLINT_TS_CONFIG : ESLINT_CONFIG,
      });
    } else if (!tooling.eslint.wired) {
      edits.push({
        file: tooling.eslint.config,
        what: tooling.eslint.next
          ? "Import the preset and spread it after the Next.js configs: import koobiq from './.koobiq/eslint.koobiq.mjs'; … [...nextVitals, ...nextTs, ...koobiq]"
          : "Import the preset and spread it at the end of the exported config: import koobiq from './.koobiq/eslint.koobiq.mjs'; … [...existing, ...koobiq] (with defineConfig / tseslint.config pass ...koobiq as the last argument)",
        snippet: "import koobiq from './.koobiq/eslint.koobiq.mjs';",
      });

      if (tooling.eslint.typed) {
        edits.push({
          file: tooling.eslint.config,
          what: 'The project lints with type information: also spread `typed` (adds @typescript-eslint/no-deprecated).',
          snippet:
            "import koobiq, { typed } from './.koobiq/eslint.koobiq.mjs';",
        });
      }

      if (tooling.eslint.version && majorOf(tooling.eslint.version) < 9) {
        notes.push(
          `ESLint ${tooling.eslint.version}: flat config needs ESLint 8.57 or newer.`
        );
      }
    }
  }

  if (!eslintOnly && tooling.styles.length) {
    if (!tooling.stylelint.version && !tooling.stylelint.config) {
      devDependencies.push(
        'stylelint',
        ...(tooling.styles.includes('scss') ? ['postcss-scss'] : []),
        ...(tooling.styles.includes('less') ? ['postcss-less'] : [])
      );

      files.push({
        file: 'stylelint.config.mjs',
        status: 'create',
        write: true,
        content: stylelintConfig(tooling.styles),
      });
    } else if (
      tooling.stylelint.version &&
      majorOf(tooling.stylelint.version) < 16
    ) {
      notes.push(
        `Stylelint ${tooling.stylelint.version} is older than 16; upgrade it to use the Koobiq Stylelint preset.`
      );
    } else if (!tooling.stylelint.wired) {
      edits.push({
        file: tooling.stylelint.config,
        what: "Add './.koobiq/stylelint.koobiq.mjs' to extends.",
        snippet: "extends: [/* existing */ './.koobiq/stylelint.koobiq.mjs']",
      });
    }
  }

  if (tooling.prettier && !tooling.prettierIgnored) {
    files.push({
      file: '.prettierignore',
      status: fs.existsSync(path.join(root, '.prettierignore'))
        ? 'append'
        : 'create',
      write: true,
      append: '.koobiq/\n',
    });
  }

  for (const file of files) {
    if (file.status === 'modified' && !force) {
      notes.push(
        `${file.file} was edited locally; re-run with --force to overwrite it (move local tweaks into your own lint config first).`
      );
    }
  }

  return {
    root: root.split(path.sep).join('/'),
    presetVersion: PRESET_VERSION,
    tooling,
    files: files.map((file) => {
      const entry = { ...file };

      delete entry.content;

      return entry;
    }),
    edits,
    devDependencies,
    install: installCommand(tooling.packageManager, devDependencies),
    notes,
    _contents: Object.fromEntries(
      files.filter((f) => f.content).map((f) => [f.file, f.content])
    ),
  };
}

export function applySetup(root, plan) {
  const written = [];

  for (const file of plan.files) {
    if (!file.write) continue;

    const target = path.join(root, file.file);

    fs.mkdirSync(path.dirname(target), { recursive: true });

    if (file.append) {
      const current = read(target) || '';
      const separator = current && !current.endsWith('\n') ? '\n' : '';

      fs.writeFileSync(target, `${current}${separator}${file.append}`);
    } else {
      fs.writeFileSync(target, plan._contents[file.file]);
    }

    written.push(file.file);
  }

  return written;
}

function main() {
  const args = process.argv.slice(2);

  const value = (name) => {
    const index = args.indexOf(`--${name}`);

    return index === -1 ? undefined : args[index + 1];
  };

  const root = path.resolve(value('root') || process.cwd());

  const plan = planSetup({
    root,
    eslintOnly: args.includes('--eslint-only'),
    stylelintOnly: args.includes('--stylelint-only'),
    force: args.includes('--force'),
  });

  if (args.includes('--apply')) plan.written = applySetup(root, plan);

  delete plan._contents;
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
