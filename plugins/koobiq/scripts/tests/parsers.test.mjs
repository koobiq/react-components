import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, test } from 'node:test';

import {
  parseScriptWithRegex,
  parseScriptWithTs,
} from '../lib/parse-script.mjs';
import { maskComments, parseStyle } from '../lib/parse-style.mjs';
import { lineStarts, positionAt } from '../lib/util.mjs';

import { REPO_TYPESCRIPT } from './helpers.mjs';

const ts = REPO_TYPESCRIPT
  ? createRequire(import.meta.url)(REPO_TYPESCRIPT)
  : null;

describe('parseStyle', () => {
  test('selectors, declarations, refs and definitions with offsets', () => {
    const css = [
      '/* .kbq-x { } */',
      '.a { color: var(--kbq-foreground-contrast); }',
      ':global(.kbq-dark) .a {',
      '  --kbq-flag-size: 2px;',
      '  border: 1px solid var(--kbq-line, red) !important;',
      '}',
    ].join('\r\n');

    const facts = parseStyle(css);
    const starts = lineStarts(css);

    assert.deepEqual(
      facts.selectors.map((s) => s.text),
      ['.a', ':global(.kbq-dark) .a']
    );

    assert.deepEqual(
      facts.varRefs.map((r) => [r.name, r.hasFallback]),
      [
        ['--kbq-foreground-contrast', false],
        ['--kbq-line', true],
      ]
    );

    assert.equal(positionAt(starts, facts.varRefs[1].offset).line, 5);

    assert.deepEqual(
      facts.varDefs.map((d) => [d.name, d.inThemeBlock]),
      [['--kbq-flag-size', true]]
    );

    const border = facts.declarations.find((d) => d.prop === 'border');

    assert.equal(border.important, true);
    assert.equal(border.inThemeBlock, true);
  });

  test('scss: line comments, interpolation and static token variables', () => {
    const scss = [
      "@use '@koobiq/design-tokens/web/new/variables' as t; // tokens",
      '.b { background: url(//cdn.example/x.png); // not a comment inside url',
      '  padding: var(--kbq-size-#{$size});',
      '  color: t.$dark-foreground-contrast;',
      '}',
    ].join('\n');

    const facts = parseStyle(scss, { syntax: 'scss' });

    assert.deepEqual(
      facts.imports.map((i) => i.source),
      ['@koobiq/design-tokens/web/new/variables']
    );

    assert.deepEqual(
      facts.varRefs.map((r) => r.dynamicPrefix),
      ['--kbq-size-']
    );

    assert.deepEqual(
      facts.scssVars.map((v) => v.name),
      ['$dark-foreground-contrast']
    );

    assert.ok(
      facts.declarations.some(
        (d) => d.prop === 'background' && d.value.includes('cdn.example')
      )
    );
  });

  test('maskComments keeps offsets', () => {
    const text = 'a /* b */ c';

    assert.equal(maskComments(text).length, text.length);
    assert.equal(maskComments(text), 'a         c');
  });
});

const SOURCE = [
  "import Kbq, { Button as KButton, type Key } from '@koobiq/react-components';",
  "import * as K from '@koobiq/react-components';",
  "import './styles.css';",
  "export { Modal } from '@koobiq/react-components';",
  "const lazy = import('@koobiq/react-components/markdown');",
  'const css = styled.div`color: ${(p) => p.c}; background: #fff;`;',
  'export const A = () => (',
  '  <K.Modal.Header>',
  '    <KButton isDisabled variant="theme-transparent" size={2} slotProps={{ label: {} }} {...rest}>Save</KButton>',
  "    <div style={{ backgroundColor: '#fff', zIndex: 2 }} />",
  '  </K.Modal.Header>',
  ');',
].join('\n');

describe('parseScript', () => {
  test('T1 (TypeScript) facts', (t) => {
    if (!ts) {
      t.skip('typescript is not installed');

      return;
    }

    const facts = parseScriptWithTs(SOURCE, 'a.tsx', ts);
    const first = facts.imports[0];

    assert.deepEqual(
      first.specifiers.map((s) => [
        s.imported,
        s.local,
        s.kind,
        Boolean(s.typeOnly),
      ]),
      [
        ['default', 'Kbq', 'default', false],
        ['Button', 'KButton', 'named', false],
        ['Key', 'Key', 'named', true],
      ]
    );

    assert.deepEqual(
      facts.imports.map((i) => i.kind),
      ['static', 'static', 'side-effect', 'reexport', 'dynamic']
    );

    const button = facts.elements.find((e) => e.root === 'KButton');

    assert.deepEqual(
      button.attrs.map((a) => [a.name, a.kind]),
      [
        ['isDisabled', 'boolean'],
        ['variant', 'literal'],
        ['size', 'number'],
        ['slotProps', 'expression'],
      ]
    );

    assert.deepEqual(button.attrs[3].keys, ['label']);
    assert.equal(button.spread, true);
    assert.equal(button.textChildren, 'Save');

    const header = facts.elements.find((e) => e.root === 'K');

    assert.equal(header.member, 'Modal.Header');

    assert.deepEqual(
      facts.styleObjects.map((d) => [d.prop, d.value]),
      [
        ['background-color', '#fff'],
        ['z-index', '2'],
      ]
    );

    assert.equal(facts.styleBlocks.length, 1);
    assert.match(facts.styleBlocks[0].text, /color: _+; background: #fff;/);
  });

  test('T0 (regex) facts', () => {
    const facts = parseScriptWithRegex(SOURCE);
    const button = facts.elements.find((e) => e.root === 'KButton');

    assert.ok(
      facts.imports.some(
        (i) =>
          i.source === '@koobiq/react-components' &&
          i.specifiers.some((s) => s.local === 'KButton')
      )
    );

    assert.deepEqual(
      button.attrs.map((a) => a.name),
      ['isDisabled', 'variant', 'size', 'slotProps']
    );

    assert.equal(button.spread, true);
    assert.equal(facts.styleBlocks.length, 1);
  });
});
