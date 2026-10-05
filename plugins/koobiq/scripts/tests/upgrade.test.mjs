import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  compareVersions,
  diffApi,
  gatherUpgrade,
  parseChangelog,
} from '../koobiq-upgrade.mjs';
import { sha1 } from '../lib/util.mjs';

import { makeApp } from './helpers.mjs';

const CHANGELOG = `# Changelog

## [9.10.0](https://github.com/koobiq/react-components/compare/9.9.0...9.10.0) (2026-10-01)


### ⚠ BREAKING CHANGES

* **Button:** remove \`progress\` ([#501](https://github.com/x/issues/501)) ([abc1234](https://github.com/x/commit/abc1234))

### 🚀 Features

* **Modal:** add \`size\` prop ([#500](https://github.com/x/issues/500)) ([def5678](https://github.com/x/commit/def5678))
* **Tabs:** add overflow menu

### 🐞 Bug Fixes

* **Input:** keep caret position (DS-1) ([#499](https://github.com/x/issues/499)) ([0123456](https://github.com/x/commit/0123456))

## [9.9.0](https://github.com/koobiq/react-components/compare/9.8.0...9.9.0) (2026-09-01)

### 🚀 Features

* **components:** add \`Highlight\` component
`;

const api = (members) =>
  ['```ts', 'export type ButtonBaseProps = {', ...members, '};', '```'].join(
    '\n'
  );

describe('upgrade', () => {
  test('parses the changelog', () => {
    const [latest, previous] = parseChangelog(CHANGELOG);

    assert.equal(latest.version, '9.10.0');
    assert.equal(latest.date, '2026-10-01');

    assert.deepEqual(
      latest.entries.map((e) => [e.type, e.scopes.join(','), e.breaking]),
      [
        ['breaking', 'Button', true],
        ['feat', 'Modal', false],
        ['feat', 'Tabs', false],
        ['fix', 'Input', false],
      ]
    );

    assert.equal(latest.entries[0].text, 'remove `progress`');
    assert.equal(previous.version, '9.9.0');
  });

  test('compares versions and diffs API reports', () => {
    assert.ok(compareVersions('0.10.0', '0.9.9') > 0);
    assert.equal(compareVersions('1.2.3', '1.2.3'), 0);

    assert.deepEqual(
      diffApi(
        api(['  progress?: boolean;', '  variant?: string;']),
        api(['  variant?: string;', '  isLoading?: boolean;'])
      ),
      {
        removed: ['  progress?: boolean;'],
        added: ['  isLoading?: boolean;'],
      }
    );
  });

  test('gathers an upgrade offline from the cache', async () => {
    const app = makeApp('good-app');
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koobiq-upgrade-'));

    const put = (url, text) =>
      fs.writeFileSync(
        path.join(cacheDir, `${sha1(url).slice(0, 20)}.txt`),
        text
      );

    const raw = 'https://raw.githubusercontent.com/koobiq/react-components';

    put(
      'https://registry.npmjs.org/@koobiq%2freact-components',
      JSON.stringify({
        'dist-tags': { latest: '9.10.0' },
        versions: {
          '9.9.0': { peerDependencies: { '@koobiq/design-tokens': '^3.17.2' } },
          '9.10.0': {
            peerDependencies: { '@koobiq/design-tokens': '^3.18.0' },
          },
        },
      })
    );

    put(`${raw}/9.10.0/CHANGELOG.md`, CHANGELOG);

    put(
      `${raw}/9.9.0/tools/public_api_guard/components/Button.api.md`,
      api(['  progress?: boolean;'])
    );

    put(
      `${raw}/9.10.0/tools/public_api_guard/components/Button.api.md`,
      api(['  isLoading?: boolean;'])
    );

    try {
      const result = await gatherUpgrade({
        root: app.dir,
        to: 'latest',
        components: ['Button', 'Input'],
        cacheDir,
        offline: true,
      });

      assert.equal(result.from, '9.9.0');
      assert.equal(result.to, '9.10.0');
      assert.deepEqual(result.versions, ['9.10.0']);

      assert.deepEqual(result.peerDependencies.changed, [
        { name: '@koobiq/design-tokens', from: '^3.17.2', to: '^3.18.0' },
      ]);

      assert.deepEqual(
        result.changelog[0].entries
          .filter((e) => e.relevant)
          .map((e) => e.scopes[0]),
        ['Button', 'Input']
      );

      assert.deepEqual(result.apiDiffs.Button, {
        removed: ['  progress?: boolean;'],
        added: ['  isLoading?: boolean;'],
      });
    } finally {
      app.cleanup();
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
  });
});
