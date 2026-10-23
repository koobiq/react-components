import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';

import { applySetup, installCommand, planSetup } from '../setup-lint.mjs';

const project = (files) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'koobiq-lint-'));

  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    fs.writeFileSync(path.join(root, name), content);
  }

  return root;
};

const status = (plan) =>
  Object.fromEntries(plan.files.map((f) => [f.file, f.status]));

describe('setup-lint', () => {
  test('flat ESLint, no Stylelint, pnpm, Prettier', () => {
    const root = project({
      'package.json': JSON.stringify({
        devDependencies: {
          eslint: '^9.0.0',
          prettier: '^3.0.0',
          typescript: '^5.0.0',
        },
      }),
      'pnpm-lock.yaml': '',
      'eslint.config.mjs': 'export default [];\n',
      'src/app.module.scss': '.a { color: red; }\n',
    });

    try {
      const plan = planSetup({ root });

      assert.equal(plan.tooling.packageManager, 'pnpm');
      assert.equal(plan.tooling.eslint.style, 'flat');

      assert.deepEqual(status(plan), {
        '.koobiq/koobiq-core.mjs': 'create',
        '.koobiq/eslint.koobiq.mjs': 'create',
        '.koobiq/stylelint.koobiq.mjs': 'create',
        '.koobiq/check.json': 'create',
        'stylelint.config.mjs': 'create',
        '.prettierignore': 'create',
      });

      assert.equal(plan.edits[0].file, 'eslint.config.mjs');
      assert.equal(plan.install, 'pnpm add -D stylelint postcss-scss');

      const written = applySetup(root, plan);

      assert.ok(written.includes('.koobiq/eslint.koobiq.mjs'));

      assert.match(
        fs.readFileSync(
          path.join(root, '.koobiq', 'eslint.koobiq.mjs'),
          'utf8'
        ),
        /^\/\/ @koobiq\/lint-preset file=eslint\.koobiq\.mjs preset=\d+ generated=\S+ sha256=[0-9a-f]{64}\n/
      );

      assert.match(
        fs.readFileSync(path.join(root, 'stylelint.config.mjs'), 'utf8'),
        /customSyntax: 'postcss-scss'/
      );

      const again = planSetup({ root });

      assert.equal(status(again)['.koobiq/koobiq-core.mjs'], 'unchanged');
      assert.ok(!again.files.some((f) => f.file === '.koobiq/check.json'));
      assert.ok(!again.files.some((f) => f.file === '.prettierignore'));

      fs.appendFileSync(
        path.join(root, '.koobiq', 'koobiq-core.mjs'),
        '// local tweak\n'
      );

      const edited = planSetup({ root });

      assert.equal(status(edited)['.koobiq/koobiq-core.mjs'], 'modified');
      assert.ok(edited.notes.some((n) => /edited locally/.test(n)));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test('legacy .eslintrc is not converted silently', () => {
    const root = project({
      'package.json': JSON.stringify({ devDependencies: { eslint: '^8.0.0' } }),
      'package-lock.json': '{}',
      '.eslintrc.json': '{}',
    });

    try {
      const plan = planSetup({ root });

      assert.equal(plan.tooling.eslint.style, 'legacy');

      assert.ok(
        !plan.files.some((f) => f.file === '.koobiq/eslint.koobiq.mjs')
      );

      assert.ok(plan.notes.some((n) => /migrate-config/.test(n)));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test('no ESLint: creates a config and installs eslint', () => {
    const root = project({
      'package.json': JSON.stringify({
        dependencies: { react: '^19.0.0' },
        devDependencies: { typescript: '^5.0.0' },
      }),
      'yarn.lock': '',
    });

    try {
      const plan = planSetup({ root });

      assert.equal(status(plan)['eslint.config.mjs'], 'create');
      assert.equal(plan.install, 'yarn add -D eslint typescript-eslint');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test('install commands per package manager', () => {
    assert.equal(installCommand('npm', ['eslint']), 'npm install -D eslint');
    assert.equal(installCommand('bun', ['eslint']), 'bun add -d eslint');
    assert.equal(installCommand('pnpm', []), null);
  });
});
