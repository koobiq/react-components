import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { TOOL_VERSION } from '../lib/engine.mjs';

import { CLI, REPO_TYPESCRIPT, makeApp } from './helpers.mjs';

const run = (args, options = {}) =>
  spawnSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    windowsHide: true,
    ...options,
  });

describe('koobiq-check CLI', () => {
  test('--help, --version and --list-rules', () => {
    assert.match(run(['--help']).stdout, /Usage: node koobiq-check\.mjs/);
    assert.equal(run(['--version']).stdout.trim(), TOOL_VERSION);
    assert.ok(JSON.parse(run(['--list-rules']).stdout)['token/unknown']);
  });

  test('usage errors exit with 2', () => {
    const result = run(['--bogus']);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /Unknown option: --bogus/);
    assert.equal(run(['--changed', '--files', 'a.ts']).status, 2);
  });

  test('--fail-on, --out and --files-from', () => {
    const app = makeApp('bad-app');
    const ts = REPO_TYPESCRIPT ? ['--typescript', REPO_TYPESCRIPT] : [];

    try {
      const failing = run([
        '--root',
        app.dir,
        '--fail-on',
        'error',
        '--format',
        'text',
        ...ts,
      ]);

      assert.equal(failing.status, 1);
      assert.match(failing.stdout, /setup\/legacy-token-set/);

      const list = path.join(app.dir, 'files.txt');

      fs.writeFileSync(list, 'src/widgets.jsx\n');

      const out = run([
        '--root',
        app.dir,
        '--files-from',
        list,
        '--out',
        'report.json',
        ...ts,
      ]);

      const report = JSON.parse(
        fs.readFileSync(path.join(app.dir, 'report.json'), 'utf8')
      );

      assert.equal(out.status, 0);
      assert.match(out.stdout, /Full report: /);
      assert.equal(report.meta.mode, 'files');
      assert.deepEqual(report.meta.files, ['src/widgets.jsx']);
      assert.ok(report.findings.some((f) => f.id === 'import/deep'));
    } finally {
      app.cleanup();
    }
  });
});
