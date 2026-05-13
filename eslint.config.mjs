import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sourceFiles = ['**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}'];

export default defineConfig(
  {
    ignores: [
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
      'storybook-static/**',
      'node_modules/**',
      '.snapshots/**',
      '**/*.min.js',
      'templates/nextjs/template/**',
      'templates/vite/template/**',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    files: sourceFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  jsdoc.configs['flat/recommended-typescript'],
  {
    files: sourceFiles,
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'no-alert': 'error',
      'no-console': 'off',
      'no-debugger': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-bitwise': 'off',
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'react/prop-types': 'off',
      'react/jsx-handler-names': 'off',
      'react/jsx-fragments': 'off',
      'react/no-unused-prop-types': 'off',
      'jsx-a11y/no-autofocus': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/first': 'error',
      'import/no-absolute-path': 'error',
      'import/no-amd': 'error',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-import-module-exports': ['error', { exceptions: [] }],
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': ['error', { commonjs: true }],
      'import/no-webpack-loader-syntax': 'error',
      'import/newline-after-import': 'error',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['selector'],
        },
      ],
    },
  },
  {
    files: [
      '**/__tests__/**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
      '**/*.{spec,test}.{js,cjs,mjs,jsx,ts,tsx,mts,cts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
  {
    files: ['**/*.stories.{js,cjs,mjs,jsx,ts,tsx,mts,cts}'],
    rules: {
      'no-alert': 'off',
    },
  },
  prettier
);
