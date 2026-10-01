// Checks against real packages: the starter templates with the installed
// DS, and (with KOOBIQ_DS_DIR) the contract between a built DS and the
// knowledge extractor — the place where DS changes can break the plugin.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  componentDocsId,
  isHashedClassName,
  loadDsKnowledge,
} from '../../lint/koobiq-core.mjs';

import { REPO_ROOT, check } from './helpers.mjs';

const installedDs = path.join(
  REPO_ROOT,
  'node_modules',
  '@koobiq',
  'react-components',
  'package.json'
);

describe('starter templates', () => {
  for (const name of ['vite', 'nextjs']) {
    test(`templates/${name}`, (t) => {
      if (!fs.existsSync(installedDs)) {
        t.skip('install the workspace dependencies first');

        return;
      }

      const report = check(path.join(REPO_ROOT, 'templates', name, 'template'));
      const ids = report.findings.map((f) => f.id);

      assert.ok(
        ids.includes('setup/legacy-token-set') || report.meta.tokenSet === 'new'
      );

      assert.ok(
        !ids.includes('style/hashed-class'),
        'theme selectors are not hashed classes'
      );

      assert.ok(
        !ids.includes('style/hardcoded-color') ||
          report.findings.every(
            (f) =>
              f.id !== 'style/hardcoded-color' ||
              !f.file.includes('AnimatedBackground')
          )
      );

      assert.equal(report.meta.errors.length, 0);
    });
  }
});

describe('contract with the built DS', () => {
  const dsDir = process.env.KOOBIQ_DS_DIR;

  test('knowledge extraction', (t) => {
    if (!dsDir) {
      t.skip('set KOOBIQ_DS_DIR to a built @koobiq/react-components');

      return;
    }

    const ds = loadDsKnowledge(path.resolve(dsDir));

    assert.ok(
      ds.exportIndex.size > 0,
      `no exports found in ${dsDir}: build the package first (pnpm build)`
    );

    const runtime = [...ds.deprecatedProps.values()]
      .flatMap((m) => [...m.values()])
      .filter((i) => i.source === 'runtime');

    assert.ok(
      runtime.length >= 50,
      `deprecate() messages found: ${runtime.length}`
    );

    assert.equal(
      ds.deprecatedProps.get('Button').get('disabled').replacement,
      'isDisabled'
    );

    assert.ok(
      ds.enums.get('Button').get('variant').includes('contrast-filled')
    );

    assert.ok(ds.styles.overridePoints.has('--kbq-flag-size'));
    assert.ok(ds.fieldComponents.has('Input'));

    for (const name of ds.styles.globalClasses) {
      assert.ok(
        ['kbq-light', 'kbq-dark'].includes(name) || name.startsWith('kbq-Tree'),
        `unexpected global class ${name}`
      );
    }

    for (const name of ds.styles.hashedClasses)
      assert.ok(isHashedClassName(name));

    const storiesRoot = path.join(
      REPO_ROOT,
      'packages',
      'components',
      'src',
      'components'
    );

    if (fs.existsSync(storiesRoot)) {
      const titles = new Set();

      const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);

          if (entry.isDirectory()) walk(full);
          else if (entry.name.endsWith('.stories.tsx')) {
            const match = fs
              .readFileSync(full, 'utf8')
              .match(/title:\s*'Components\/([^']+)'/);

            if (match)
              titles.add(
                `components-${match[1].toLowerCase().replace(/\//g, '-')}--docs`
              );
          }
        }
      };

      walk(storiesRoot);

      for (const name of ds.fieldComponents) {
        assert.ok(titles.has(componentDocsId(name)), `docs page for ${name}`);
      }
    }
  });
});
