import assert from 'node:assert/strict';
import { describe, test, before, after } from 'node:test';

import {
  RULES,
  checkClassReferences,
  checkDeclaration,
  checkElement,
  checkImport,
  checkTokenDef,
  checkTokenRef,
  clearKnowledgeCache,
  closestNames,
  findColorLiterals,
  loadKnowledge,
  parseColor,
  scanDeprecatedMembers,
} from '../../lint/koobiq-core.mjs';

import { makeApp } from './helpers.mjs';

describe('rule registry', () => {
  test('every rule is well formed', () => {
    for (const [id, rule] of Object.entries(RULES)) {
      assert.match(id, /^[a-z0-9]+\/[a-z0-9-]+$/, id);
      assert.equal(id.split('/')[0], rule.category, id);
      assert.ok(['error', 'warning', 'info'].includes(rule.severity), id);
      assert.ok(['script', 'agent', 'both'].includes(rule.detector), id);
      assert.ok(rule.docs && rule.summary, id);
    }
  });
});

describe('colors', () => {
  test('parses hex, rgb, hsl and oklch', () => {
    assert.deepEqual(parseColor('#fff'), [255, 255, 255, 1]);
    assert.deepEqual(parseColor('#0000000a'), [0, 0, 0, 0.04]);
    assert.deepEqual(parseColor('rgb(255 0 0 / 50%)'), [255, 0, 0, 0.5]);

    assert.deepEqual(
      parseColor('hsla(216, 100%, 50%, 100%)'),
      [0, 102, 255, 1]
    );

    assert.deepEqual(parseColor('oklch(100% 0 0)'), [255, 255, 255, 1]);
    assert.equal(parseColor('var(--x)'), null);
  });

  test('ignores colors inside var() fallbacks', () => {
    assert.deepEqual(
      findColorLiterals('var(--kbq-x, #fff) #000').map((c) => c.literal),
      ['#000']
    );
  });
});

test('closestNames suggests near misses', () => {
  assert.deepEqual(
    closestNames('--kbq-size-mm', [
      '--kbq-size-m',
      '--kbq-size-xl',
      '--kbq-line-x',
    ]).slice(0, 1),
    ['--kbq-size-m']
  );
});

test('scanDeprecatedMembers is depth aware', () => {
  const found = scanDeprecatedMembers(
    [
      'export type DatePickerProps = {',
      '    /** The label. */',
      '    label?: string;',
      '    slotProps?: {',
      '        /** @deprecated */',
      '        label?: FormFieldLabelProps;',
      '    };',
      '    /**',
      '     * @deprecated',
      '     * The "open" prop is deprecated. Use "isOpen" prop to replace it.',
      '     */',
      '    open?: boolean;',
      '};',
    ].join('\n')
  );

  assert.deepEqual(
    found.map((f) => [f.alias, f.path.join('.'), f.name]),
    [
      ['DatePickerProps', 'slotProps', 'label'],
      ['DatePickerProps', '', 'open'],
    ]
  );
});

describe('knowledge from installed packages', () => {
  let app;
  let knowledge;

  before(() => {
    app = makeApp('good-app');
    clearKnowledgeCache();
    knowledge = loadKnowledge(app.dir);
  });

  after(() => app.cleanup());

  test('runtime deprecate() messages win over wrong JSDoc', () => {
    const { deprecatedProps } = knowledge.ds;

    assert.equal(
      deprecatedProps.get('Checkbox').get('readonly').replacement,
      'isReadOnly'
    );

    assert.equal(
      deprecatedProps.get('Link').get('visitable').replacement,
      'allowVisited'
    );

    assert.equal(
      deprecatedProps.get('Input').get('disabled').replacement,
      'isDisabled'
    );

    assert.ok(deprecatedProps.get('DatePicker').has('slotProps.label'));
    assert.ok(!deprecatedProps.get('DatePicker').has('label'));
  });

  test('exports, enums, fields, optional peers and styles', () => {
    const { ds, tokens, icons } = knowledge;

    assert.ok(ds.exportIndex.has('useLocale'));

    assert.equal(
      ds.exportIndex.get('useLocale').external,
      '@koobiq/react-core'
    );

    assert.ok(ds.deprecatedExports.has('ModalHeader'));
    assert.ok(ds.deprecatedExports.has('TypographyDisplayVariant'));

    assert.deepEqual(ds.enums.get('Button').get('variant').slice(0, 2), [
      'contrast-filled',
      'fade-contrast-filled',
    ]);

    assert.ok(
      ds.fieldComponents.has('Input') && ds.fieldComponents.has('SelectNext')
    );

    assert.ok(!ds.fieldComponents.has('Checkbox'));

    assert.deepEqual(ds.optionalPeers.get('./markdown'), [
      'react-markdown',
      'remark-gfm',
    ]);

    assert.ok(ds.styles.overridePoints.has('--kbq-flag-size'));
    assert.ok(ds.styles.hashedClasses.has('kbq-button-5c3f2a'));
    assert.ok(tokens.sets.new.has('--kbq-foreground-white'));
    assert.ok(tokens.sets.legacy.has('--kbq-palette-grey-50'));

    assert.match(
      tokens.sets.new.get('--kbq-foreground-error-less').deprecated,
      /tertiary/
    );

    assert.ok(icons.names.has('IconChevronRight16'));
  });

  test('import decisions', () => {
    const ids = (fact) => checkImport(fact, { knowledge }).map((f) => f.id);

    assert.deepEqual(
      ids({
        source: '@koobiq/react-components',
        specifiers: [{ imported: 'Markdown', kind: 'named' }],
      }),
      ['import/unknown-export']
    );

    assert.deepEqual(
      ids({ source: '@koobiq/react-components/dist/x', specifiers: [] }),
      ['import/deep']
    );

    assert.deepEqual(
      ids({
        source: '@koobiq/react-core',
        specifiers: [{ imported: 'useLocale', kind: 'named' }],
      }),
      ['import/internal-layer']
    );

    assert.deepEqual(
      ids({
        source: '@koobiq/react-core',
        typeOnly: true,
        specifiers: [{ imported: 'Internal', kind: 'named', typeOnly: true }],
      }),
      []
    );

    // Documented hooks and primitives are public API of those packages.
    assert.deepEqual(
      ids({
        source: '@koobiq/react-core',
        specifiers: [{ imported: 'useBoolean', kind: 'named' }],
      }),
      []
    );

    assert.deepEqual(
      ids({
        source: '@koobiq/react-primitives',
        specifiers: [{ imported: 'Button', kind: 'named' }],
      }),
      []
    );

    assert.deepEqual(
      ids({
        source: '@mui/material',
        specifiers: [{ imported: 'Dialog', kind: 'named' }],
      }),
      ['import/other-ui-kit']
    );

    assert.deepEqual(
      ids({ source: '@/components/ui/select', specifiers: [] }),
      ['import/other-ui-kit']
    );

    assert.deepEqual(
      ids({
        source: '@koobiq/react-icons',
        specifiers: [{ imported: 'IconTrash16', kind: 'named' }],
      }),
      []
    );

    assert.deepEqual(
      ids({ source: '@internationalized/date', specifiers: [] }),
      []
    );
  });

  test('element decisions', () => {
    const ids = (fact) =>
      checkElement(fact, { knowledge })
        .map((f) => f.id)
        .sort();

    assert.deepEqual(
      ids({ dsName: 'Modal', attrs: [{ name: 'open', kind: 'boolean' }] }),
      ['deprecated/prop']
    );

    assert.deepEqual(
      ids({
        dsName: 'Modal.Header',
        attrs: [{ name: 'open', kind: 'boolean' }],
      }),
      []
    );

    assert.deepEqual(
      ids({
        dsName: 'IconButton',
        attrs: [{ name: 'aria-label', kind: 'literal', value: 'Close' }],
      }),
      []
    );

    assert.deepEqual(
      ids({ dsName: 'IconButton', attrs: [], spread: true }),
      []
    );

    assert.deepEqual(
      ids({
        dsName: 'Input',
        attrs: [
          { name: 'aria-label', kind: 'literal', value: 'Q' },
          { name: 'value', kind: 'expression' },
          { name: 'isReadOnly', kind: 'boolean' },
        ],
      }),
      []
    );

    assert.deepEqual(
      ids({
        dsName: 'Button',
        attrs: [{ name: 'onlyIcon', kind: 'boolean' }],
        hasChildren: true,
        textChildren: '',
      }),
      ['a11y/icon-button-label']
    );
  });

  test('token decisions depend on the active token set', () => {
    const ids = (fact, tokenSet) =>
      checkTokenRef(fact, { knowledge, tokenSet }).map((f) => f.id);

    assert.deepEqual(ids({ name: '--kbq-foreground-white' }, 'new'), []);

    assert.deepEqual(ids({ name: '--kbq-palette-grey-50' }, 'new'), [
      'token/unknown',
    ]);

    assert.deepEqual(ids({ name: '--kbq-palette-grey-50' }, 'legacy'), [
      'token/legacy-only',
    ]);

    assert.deepEqual(ids({ name: '--kbq-foreground-error-less' }, 'new'), [
      'token/deprecated',
    ]);

    assert.deepEqual(ids({ name: '--kbq-flag-size' }, 'new'), []);
    assert.deepEqual(ids({ name: '--kbq-layer-overlay' }, 'new'), []);
    assert.deepEqual(ids({ dynamicPrefix: '--kbq-size-' }, 'new'), []);

    assert.equal(
      checkTokenRef(
        { name: '--kbq-nope', hasFallback: true },
        { knowledge, tokenSet: 'new' }
      )[0].severity,
      'warning'
    );

    assert.deepEqual(
      checkTokenDef({ name: '--kbq-tag-color' }, { knowledge }),
      []
    );

    assert.deepEqual(
      checkTokenDef({ name: '--kbq-mine' }, { knowledge }).map((f) => f.id),
      ['token/defines-unknown-public-var']
    );
  });

  test('class references and declarations', () => {
    const classIds = (text) =>
      checkClassReferences(text, { knowledge }).map((f) => f.id);

    assert.deepEqual(classIds(':global(.kbq-light) .card'), []);

    assert.deepEqual(classIds('.wrap .kbq-button-5c3f2a'), [
      'style/hashed-class',
    ]);

    assert.deepEqual(classIds('.kbq-Tree'), ['style/ds-global-class']);

    const declIds = (fact) =>
      checkDeclaration(fact, { knowledge }).map((f) => f.id);

    assert.deepEqual(
      declIds({ prop: 'color', value: '#fff', inThemeBlock: true }),
      []
    );

    assert.deepEqual(declIds({ prop: 'color', value: 'currentColor' }), []);

    assert.deepEqual(
      declIds({ prop: 'color', value: 'var(--kbq-x, #fff)' }),
      []
    );

    assert.deepEqual(declIds({ prop: 'background', value: '#ffffff' }), [
      'style/hardcoded-color',
    ]);

    assert.deepEqual(declIds({ prop: 'z-index', value: '10' }), []);

    assert.deepEqual(declIds({ prop: 'z-index', value: '1000' }), [
      'style/hardcoded-z-index',
    ]);
  });
});
