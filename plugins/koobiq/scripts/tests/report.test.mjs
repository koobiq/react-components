import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { collectSuppressions, finalizeFindings } from '../lib/report.mjs';
import { lineStarts } from '../lib/util.mjs';

const source = (text) => ({ text, starts: lineStarts(text) });

describe('suppressions', () => {
  test('next-line, same-line, file and preset rule names', () => {
    const s = collectSuppressions(
      [
        '// koobiq-ignore-file token/*',
        '// koobiq-ignore-next-line a11y/icon-button-label -- decorative',
        'x',
        'y // koobiq-ignore-line',
        '// eslint-disable-next-line koobiq/no-deprecated',
        'z',
      ].join('\n')
    );

    assert.deepEqual(s.file, ['token/*']);
    assert.deepEqual(s.lines.get(3), ['a11y/icon-button-label']);
    assert.equal(s.lines.get(4), null);

    assert.deepEqual(s.lines.get(6), [
      'deprecated/prop',
      'deprecated/component',
      'deprecated/export',
    ]);
  });
});

describe('finalizeFindings', () => {
  const raw = [
    { id: 'deprecated/prop', message: 'a', file: 'src/a.tsx', offset: 0 },
    { id: 'deprecated/prop', message: 'a', file: 'src/a.tsx', offset: 0 },
    { id: 'token/unknown', message: 'b', file: 'src/a.tsx', offset: 6 },
    { id: 'a11y/field-label', message: 'c', file: 'src/a.test.tsx', offset: 0 },
    {
      id: 'style/hardcoded-spacing',
      message: 'd',
      file: 'src/a.tsx',
      offset: 0,
    },
  ];

  const sources = new Map([
    ['src/a.tsx', source('line1\nline2\n')],
    ['src/a.test.tsx', source('test\n')],
  ]);

  test('dedupes, positions, downgrades tests and drops disabled rules', () => {
    const result = finalizeFindings(raw, {
      sources,
      changedLines: new Map([['src/a.tsx', [[2, 2]]]]),
    });

    assert.deepEqual(
      result.findings.map((f) => [f.id, f.file, f.line, f.severity, f.inDiff]),
      [
        ['a11y/field-label', 'src/a.test.tsx', 1, 'info', false],
        ['deprecated/prop', 'src/a.tsx', 1, 'warning', false],
        ['token/unknown', 'src/a.tsx', 2, 'error', true],
      ]
    );

    assert.equal(result.findings[1].evidence, 'line1');
    assert.match(result.findings[1].fingerprint, /^[0-9a-f]{16}$/);
  });

  test('config overrides and caps', () => {
    const result = finalizeFindings(raw, {
      sources,
      config: {
        rules: { 'token/*': 'off', 'style/hardcoded-spacing': 'info' },
      },
      maxPerFile: 1,
    });

    assert.deepEqual(
      result.findings.map((f) => f.id),
      ['a11y/field-label', 'deprecated/prop']
    );

    assert.deepEqual(result.truncated, [
      { id: 'style/hardcoded-spacing', dropped: 1 },
    ]);
  });
});
