// The plugin version: one number in plugin.json, reported by the checker,
// described in CHANGELOG.md, and bumped whenever released files change.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { checkPluginVersion } from '../../../../scripts/check-plugin-version.mjs';
import { TOOL_VERSION } from '../lib/engine.mjs';

import { PLUGIN_ROOT } from './helpers.mjs';

const manifest = JSON.parse(
  fs.readFileSync(
    path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json'),
    'utf8'
  )
);

const changelog = fs.readFileSync(
  path.join(PLUGIN_ROOT, 'CHANGELOG.md'),
  'utf8'
);

const check = (changedFiles, baseVersion, headVersion, log = changelog) =>
  checkPluginVersion({
    changedFiles,
    baseVersion,
    headVersion,
    changelog: log,
  }).problems;

describe('plugin version', () => {
  test('plugin.json, the checker and the changelog agree', () => {
    assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
    assert.equal(TOOL_VERSION, manifest.version);
    assert.equal(changelog.match(/^## (\S+)/m)?.[1], manifest.version);
  });

  test('changes outside the released files need no bump', () => {
    assert.deepEqual(
      check(
        [
          'packages/components/src/index.ts',
          'plugins/koobiq/scripts/tests/core.test.mjs',
          'plugins/koobiq/README.md',
        ],
        '1.0.0',
        '1.0.0'
      ),
      []
    );
  });

  test('a released change without a bump fails', () => {
    const problems = check(
      ['plugins/koobiq/skills/review/SKILL.md'],
      '1.0.0',
      '1.0.0'
    );

    assert.equal(problems.length, 1);
    assert.match(problems[0], /must be greater than 1\.0\.0/);
  });

  test('a bump needs its changelog section', () => {
    const changed = ['plugins/koobiq/lint/koobiq-core.mjs'];

    assert.deepEqual(
      check(changed, '1.0.0', '1.1.0', '# Changelog\n\n## 1.1.0\n\n- New.\n'),
      []
    );

    assert.match(
      check(changed, '1.0.0', '1.1.0', '# Changelog\n\n## 1.0.0\n')[0],
      /no "## 1\.1\.0" section/
    );
  });

  test('the first release only needs a version and its section', () => {
    assert.deepEqual(
      check(['plugins/koobiq/.claude-plugin/plugin.json'], null, '1.0.0'),
      []
    );

    assert.match(
      check(['plugins/koobiq/agents/reviewer.md'], null, undefined)[0],
      /needs a "version"/
    );
  });
});
