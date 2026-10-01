import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { clearKnowledgeCache } from '../../lint/koobiq-core.mjs';
import {
  buildBatches,
  prepare,
  readExceptions,
} from '../koobiq-review-prep.mjs';

import { REPO_TYPESCRIPT, makeApp } from './helpers.mjs';

describe('review prep', () => {
  test('keeps a component with its styles and respects the limits', () => {
    const files = [
      { file: 'src/a/A.tsx', lines: 100 },
      { file: 'src/a/A.module.css', lines: 50 },
      { file: 'src/b/B.tsx', lines: 900 },
      { file: 'src/c/C.tsx', lines: 900 },
    ];

    const batches = buildBatches(files, { maxFiles: 3, maxLines: 1500 });

    assert.deepEqual(
      batches.map((b) => b.files.map((f) => f.file)),
      [['src/a/A.tsx', 'src/a/A.module.css', 'src/b/B.tsx'], ['src/c/C.tsx']]
    );
  });

  test('reads exceptions from the Koobiq block', () => {
    const app = makeApp('good-app', { stubs: false });

    try {
      fs.writeFileSync(
        path.join(app.dir, 'AGENTS.md'),
        [
          '<!-- koobiq:begin v1 -->',
          '### Project exceptions',
          '<!-- koobiq:exceptions:begin -->',
          '- allow component/raw-element in src/legacy/** — legacy page',
          '- allow @mui/x-data-grid — no Koobiq data grid',
          '<!-- koobiq:exceptions:end -->',
          '<!-- koobiq:end -->',
        ].join('\n')
      );

      assert.deepEqual(
        readExceptions(app.dir).map((e) => [e.target, e.glob, e.reason]),
        [
          ['component/raw-element', 'src/legacy/**', 'legacy page'],
          ['@mui/x-data-grid', null, 'no Koobiq data grid'],
        ]
      );
    } finally {
      app.cleanup();
    }
  });

  test('writes a setup batch and file batches for an audit', () => {
    const app = makeApp('bad-app');

    try {
      clearKnowledgeCache();

      const manifest = prepare({
        root: app.dir,
        all: true,
        typescript: REPO_TYPESCRIPT,
        maxFiles: 2,
        maxLines: 1500,
      });

      assert.equal(manifest.mode, 'all');
      assert.equal(manifest.emptyScope, false);
      assert.equal(manifest.batches[0].id, 'batch-00-setup');

      const reviewed = manifest.batches
        .slice(1)
        .flatMap((b) => b.files)
        .sort();

      assert.deepEqual(reviewed, [
        'src/App.module.css',
        'src/App.tsx',
        'src/legacy.scss',
        'src/main.tsx',
        'src/widgets.jsx',
      ]);

      const batch = JSON.parse(
        fs.readFileSync(manifest.batches[1].file, 'utf8')
      );

      assert.ok(batch.candidates.length > 0);
      assert.ok(batch.candidates.every((c) => c.category !== 'setup'));
      assert.equal(batch.ds.version, '9.9.0');
      assert.equal(manifest.typescript.tier, 'resolver');
      assert.ok(fs.existsSync(path.join(manifest.runDir, 'report.json')));
    } finally {
      app.cleanup();
    }
  });

  test('--typecheck runs the language-service tier on the scoped check', () => {
    const app = makeApp('good-app');

    try {
      clearKnowledgeCache();

      const manifest = prepare({
        root: app.dir,
        paths: 'src/App.tsx',
        typecheck: true,
        typescript: REPO_TYPESCRIPT,
        maxFiles: 12,
        maxLines: 1500,
      });

      assert.equal(manifest.mode, 'paths');

      assert.equal(
        manifest.typescript.tier,
        REPO_TYPESCRIPT ? 'languageService' : 'none'
      );
    } finally {
      app.cleanup();
    }
  });
});
