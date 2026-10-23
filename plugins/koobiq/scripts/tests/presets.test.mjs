// The copied lint presets reuse koobiq-core, so on the bad-app fixture they
// must report the same problems as koobiq-check (with the token set unknown,
// they skip the set-specific "exists only in web/new" findings).
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { clearKnowledgeCache } from '../../lint/koobiq-core.mjs';

import { makeApp } from './helpers.mjs';

const tryImport = async (name) => {
  try {
    return await import(name);
  } catch {
    return null;
  }
};

const eslintModule = await tryImport('eslint');
const tseslint = (await tryImport('typescript-eslint'))?.default;
const stylelint = (await tryImport('stylelint'))?.default;

describe('lint presets', () => {
  test('ESLint preset on bad-app', async (t) => {
    if (!eslintModule || !tseslint) {
      t.skip('eslint / typescript-eslint are not installed');

      return;
    }

    const { default: koobiq } = await import('../../lint/eslint.koobiq.mjs');
    const app = makeApp('bad-app');

    try {
      clearKnowledgeCache();

      const eslint = new eslintModule.ESLint({
        cwd: app.dir,
        overrideConfigFile: true,
        overrideConfig: [
          {
            files: ['**/*.{ts,tsx,js,jsx}'],
            languageOptions: {
              parser: tseslint.parser,
              parserOptions: { ecmaFeatures: { jsx: true } },
            },
          },
          ...koobiq,
        ],
      });

      const results = await eslint.lintFiles(['src/**/*.{ts,tsx,jsx}']);

      const actual = results
        .flatMap((r) =>
          r.messages.map(
            (m) =>
              `${r.filePath.split(/[\\/]/).slice(-1)[0]}:${m.line}:${m.ruleId}`
          )
        )
        .sort();

      assert.deepEqual(actual, [
        'App.tsx:14:koobiq/no-deprecated',
        'App.tsx:15:koobiq/no-deprecated',
        'App.tsx:16:koobiq/no-deep-imports',
        'App.tsx:30:koobiq/no-deprecated',
        'App.tsx:33:koobiq/accessible-name',
        'App.tsx:36:koobiq/accessible-name',
        'App.tsx:36:koobiq/controlled-props',
        'App.tsx:37:koobiq/controlled-props',
        'App.tsx:38:koobiq/accessible-name',
        'App.tsx:38:koobiq/no-deprecated',
        'App.tsx:39:koobiq/no-deprecated',
        'App.tsx:3:koobiq/no-other-ui-kits',
        'App.tsx:40:koobiq/no-deprecated',
        'App.tsx:44:koobiq/no-hashed-classes',
        'App.tsx:46:koobiq/no-unknown-tokens',
        'App.tsx:4:koobiq/no-other-icon-libraries',
        'App.tsx:6:koobiq/no-internal-packages',
        'widgets.jsx:2:koobiq/no-deep-imports',
        'widgets.jsx:5:koobiq/no-deprecated',
      ]);
    } finally {
      app.cleanup();
    }
  });

  test('Stylelint preset on bad-app CSS', async (t) => {
    if (!stylelint) {
      t.skip('stylelint is not installed');

      return;
    }

    const { default: config } = await import('../../lint/stylelint.koobiq.mjs');
    const app = makeApp('bad-app');

    try {
      clearKnowledgeCache();

      const { results } = await stylelint.lint({
        cwd: app.dir,
        files: ['src/**/*.css'],
        config,
      });

      const actual = results
        .flatMap((r) =>
          r.warnings.map((w) => `${w.line}:${w.rule}:${w.severity}`)
        )
        .sort();

      assert.deepEqual(actual, [
        '11:koobiq/no-unknown-public-vars:warning',
        '19:koobiq/no-hashed-classes:error',
        '23:koobiq/no-hashed-classes:error',
        '2:koobiq/prefer-color-tokens:warning',
        '3:koobiq/prefer-color-tokens:warning',
        '6:koobiq/no-unknown-tokens:error',
        '7:koobiq/no-deprecated-tokens:warning',
        '7:koobiq/no-deprecated-tokens:warning',
        '8:koobiq/no-deprecated-tokens:warning',
      ]);
    } finally {
      app.cleanup();
    }
  });
});
