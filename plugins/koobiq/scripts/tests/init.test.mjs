import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  chooseTarget,
  mergeSettings,
  planInit,
  renderBlock,
} from '../init-agents.mjs';

const BLOCK = [
  '<!-- koobiq:begin v1 -->',
  'rules',
  '<!-- koobiq:exceptions:begin -->',
  '<!-- koobiq:exceptions:end -->',
  '<!-- koobiq:end -->',
].join('\n');

const tempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), 'koobiq-init-'));

describe('init-agents', () => {
  test('creates, appends, updates idempotently and keeps exceptions', () => {
    const created = renderBlock(null, BLOCK);

    assert.equal(created.action, 'create');

    const appended = renderBlock('# Project\n', BLOCK);

    assert.equal(appended.action, 'append');
    assert.match(appended.text, /^# Project\n\n<!-- koobiq:begin v1 -->/);
    assert.equal(renderBlock(appended.text, BLOCK).action, 'unchanged');

    const edited = appended.text
      .replace('rules', 'old rules')
      .replace(
        '<!-- koobiq:exceptions:begin -->\n',
        '<!-- koobiq:exceptions:begin -->\n- allow import/other-ui-kit — charts\n'
      );

    const updated = renderBlock(edited, BLOCK);

    assert.equal(updated.action, 'update');
    assert.match(updated.text, /\nrules\n/);
    assert.match(updated.text, /- allow import\/other-ui-kit — charts/);
  });

  test('refuses duplicate or broken markers', () => {
    assert.equal(renderBlock(`${BLOCK}\n${BLOCK}\n`, BLOCK).action, 'conflict');

    assert.equal(
      renderBlock('<!-- koobiq:begin v1 -->\nno end\n', BLOCK).action,
      'conflict'
    );
  });

  test('chooses AGENTS.md and notes a missing @AGENTS.md import', () => {
    const root = tempRoot();

    try {
      assert.equal(chooseTarget(root).target, 'AGENTS.md');

      fs.writeFileSync(path.join(root, 'CLAUDE.md'), '# Claude\n');
      assert.equal(chooseTarget(root).target, 'CLAUDE.md');

      fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Agents\n');

      const choice = chooseTarget(root);

      assert.equal(choice.target, 'AGENTS.md');
      assert.match(choice.notes.join(' '), /@AGENTS\.md/);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test('--share merges the marketplace without overwriting settings', () => {
    const merged = mergeSettings(
      {
        permissions: { allow: ['Bash(npm test)'] },
        enabledPlugins: { other: true },
      },
      {
        enabledPlugins: { 'koobiq@koobiq-react': true },
        extraKnownMarketplaces: { 'koobiq-react': { source: {} } },
      }
    );

    assert.deepEqual(merged.enabledPlugins, {
      other: true,
      'koobiq@koobiq-react': true,
    });

    assert.deepEqual(merged.permissions, { allow: ['Bash(npm test)'] });

    const root = tempRoot();

    try {
      const { plan } = planInit({ root, share: true });

      assert.equal(plan.action, 'create');
      assert.equal(plan.settings.action, 'create');

      assert.equal(
        plan.settings.content.enabledPlugins['koobiq@koobiq-react'],
        true
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
