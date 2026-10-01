import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  actualKeys,
  check,
  diffKeys,
  makeApp,
  readExpectations,
  REPO_TYPESCRIPT,
} from './helpers.mjs';

const assertMatches = (dir, report) => {
  const { missing, unexpected } = diffKeys(
    readExpectations(dir),
    actualKeys(report)
  );

  assert.deepEqual(
    { missing, unexpected },
    { missing: [], unexpected: [] },
    'findings differ from the fixture annotations'
  );
};

describe('fixtures', () => {
  test('bad-app: every seeded violation and nothing else (TS parser tier)', (t) => {
    if (!REPO_TYPESCRIPT) {
      t.skip('typescript is not installed');

      return;
    }

    const app = makeApp('bad-app');

    try {
      const report = check(app.dir);

      assert.equal(report.meta.tsTier, 'parser');
      assert.equal(report.meta.tokenSet, 'legacy');
      assert.equal(report.meta.errors.length, 0);
      assertMatches(app.dir, report);
    } finally {
      app.cleanup();
    }
  });

  test('good-app: no findings', () => {
    const app = makeApp('good-app');

    try {
      const report = check(app.dir);

      assert.deepEqual(actualKeys(report), []);
      assert.equal(report.meta.tokenSet, 'new');
    } finally {
      app.cleanup();
    }
  });

  test('js-app: regex tier without TypeScript', () => {
    const app = makeApp('js-app');

    try {
      const report = check(app.dir, { typescript: undefined });

      assert.equal(report.meta.tsTier, 'none');
      assertMatches(app.dir, report);
    } finally {
      app.cleanup();
    }
  });

  test('monorepo: per-package knowledge and app-only setup checks', () => {
    const app = makeApp('monorepo');

    try {
      const report = check(app.dir);

      const packages = Object.fromEntries(
        report.meta.packages.map((p) => [p.dir, p])
      );

      assert.equal(packages['apps/web'].app, true);
      assert.equal(packages['packages/ui'].app, false);
      assertMatches(app.dir, report);
    } finally {
      app.cleanup();
    }
  });

  test('no-install: knowledge rules are skipped, the rest still runs', () => {
    const app = makeApp('bad-app', { stubs: false });

    try {
      const report = check(app.dir);
      const ids = new Set(report.findings.map((f) => f.id));

      assert.ok(report.meta.skipped.some((s) => s.check === 'knowledge'));
      assert.ok(ids.has('import/other-ui-kit'));
      assert.ok(ids.has('setup/legacy-token-set'));
      assert.ok(!ids.has('deprecated/prop'));
      assert.equal(report.meta.errors.length, 0);
    } finally {
      app.cleanup();
    }
  });

  test('inline suppressions', () => {
    const app = makeApp('good-app');

    try {
      fs.writeFileSync(
        path.join(app.dir, 'src', 'Extra.tsx'),
        [
          "import { IconButton } from '@koobiq/react-components';",
          '',
          'export const A = () => (',
          '  // koobiq-ignore-next-line a11y/icon-button-label -- decorative',
          '  <IconButton />',
          ');',
          'export const B = () => <IconButton />;',
          '',
        ].join('\n')
      );

      const report = check(app.dir);

      assert.deepEqual(actualKeys(report), [
        'src/Extra.tsx:7:a11y/icon-button-label',
      ]);

      assert.equal(report.meta.suppressed, 1);
    } finally {
      app.cleanup();
    }
  });

  test('--changed: only changed files, with inDiff', (t) => {
    const git = (args, cwd) =>
      spawnSync('git', args, { cwd, encoding: 'utf8', windowsHide: true });

    if (git(['--version']).status !== 0) {
      t.skip('git is not available');

      return;
    }

    const app = makeApp('good-app');

    try {
      const env = [
        '-c',
        'user.name=t',
        '-c',
        'user.email=t@t',
        '-c',
        'core.autocrlf=false',
      ];

      fs.writeFileSync(path.join(app.dir, '.gitignore'), 'node_modules\n');
      git(['init', '-q'], app.dir);
      git([...env, 'add', '-A'], app.dir);
      git([...env, 'commit', '-q', '-m', 'init'], app.dir);

      const file = path.join(app.dir, 'src', 'App.tsx');
      const text = fs.readFileSync(file, 'utf8');

      fs.writeFileSync(
        file,
        text.replace(
          '<DatePicker label="Date" />',
          '<DatePicker label="Date" />\n      <IconButton />'
        )
      );

      const report = check(app.dir, { changed: true, base: 'HEAD' });

      const finding = report.findings.find(
        (f) => f.id === 'a11y/icon-button-label'
      );

      assert.equal(report.meta.mode, 'changed');
      assert.deepEqual(report.meta.files, ['src/App.tsx']);
      assert.ok(finding, 'the new IconButton is reported');
      assert.equal(finding.inDiff, true);
    } finally {
      app.cleanup();
    }
  });
});
