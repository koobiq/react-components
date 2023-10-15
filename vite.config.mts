import crypto from 'crypto';
import path from 'node:path';

import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import postcssLightningcss from 'postcss-lightningcss';
import mixins from 'postcss-mixins';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import { browserslist as browsers } from './package.json';

function generateCustomHash(name: string, filePath: string) {
  return crypto
    .createHash('sha256')
    .update(name + filePath)
    .digest('hex')
    .slice(0, 6);
}

export const css: UserConfig['css'] = {
  modules: {
    generateScopedName: (className, filename) => {
      const prefix = 'kbq';
      const parts = [prefix];

      const fileName = path.basename(filename, '.module.css');

      parts.push(fileName.toLowerCase());

      if (className !== 'base') {
        parts.push(className);
      }

      const hash = generateCustomHash(className, filename);

      parts.push(hash);

      return parts.join('-');
    },
  },
  postcss: {
    plugins: [
      mixins(),
      postcssLightningcss({
        lightningcssOptions: {
          minify: false,
          targets: browserslistToTargets(browserslist(browsers)),
        },
        drafts: {
          nesting: true,
        },
      }),
    ],
  },
};

export default defineConfig({
  css,
  test: {
    coverage: {
      include: ['packages/components'],
      exclude: [
        // Default
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test?(s)/**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__x00__*',
        '**/\x00*',
        'cypress/**',
        'test?(s)/**',
        'test?(-*).?(c|m)[jt]s?(x)',
        '**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
        '**/__tests__/**',
        '**/__stories__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,lint-staged,remix,astro}.config.*',
        '**/vitest.{workspace,projects}.[jt]s?(on)',
        '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
        // Custom
        'builder/**',
        '**/*.stories.*',
        '**/index.*',
      ],
    },
  },
});
