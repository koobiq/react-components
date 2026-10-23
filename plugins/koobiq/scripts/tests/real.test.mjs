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

describe('contract with the DS source', () => {
  // A prop deprecation the plugin can't parse is invisible to it, and the
  // build-level test below only counts messages, so check each call.
  const LOOKS_LIKE_PROP = /^[A-Z][\w.]*:.*"[\w$.-]+".*\bdeprecated\b/s;

  const FORMAT =
    /^[A-Z][\w.]*: the "[\w$-]+" prop is deprecated(?:\. Use "[\w$.-]+" prop to replace it\.| and ignored\..*)$/s;

  const CALL_RE = /deprecate\(\s*(['"`])([\s\S]*?)\1\s*[,)]/g;

  const sources = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) sources(full, out);
      else if (
        /\.tsx?$/.test(entry.name) &&
        !/\.(?:test|stories|e2e)\./.test(entry.name)
      )
        out.push(full);
    }

    return out;
  };

  test('deprecate() messages about props use the parsed format', (t) => {
    const roots = ['components', 'primitives']
      .map((name) => path.join(REPO_ROOT, 'packages', name, 'src'))
      .filter((dir) => fs.existsSync(dir));

    if (roots.length === 0) {
      t.skip('not running inside the Koobiq React repository');

      return;
    }

    let checked = 0;
    const wrong = [];

    for (const file of roots.flatMap((dir) => sources(dir))) {
      for (const [, , message] of fs
        .readFileSync(file, 'utf8')
        .matchAll(CALL_RE)) {
        if (!LOOKS_LIKE_PROP.test(message)) continue;

        checked += 1;

        if (!FORMAT.test(message))
          wrong.push(`${path.relative(REPO_ROOT, file)}: ${message}`);
      }
    }

    assert.ok(checked >= 50, `prop deprecations found: ${checked}`);
    assert.deepEqual(wrong, []);
  });

  test('the format check catches the old style', () => {
    assert.ok(
      LOOKS_LIKE_PROP.test(
        'Button: "disabled" is deprecated. Use "isDisabled" instead.'
      )
    );

    assert.ok(
      !FORMAT.test(
        'Button: "disabled" is deprecated. Use "isDisabled" instead.'
      )
    );

    assert.ok(
      FORMAT.test(
        'Button: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      )
    );
  });
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
