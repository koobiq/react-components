// Koobiq design-system rules for ESLint flat config (ESLint >= 8.57).
// Copied into products by /koobiq:setup-lint next to koobiq-core.mjs.
//
//   import koobiq from './.koobiq/eslint.koobiq.mjs';
//   export default [...yourConfig, ...koobiq];
//
// Named exports: recommended (default), strict, typed, plugin.
import path from 'node:path';

import {
  DS_PACKAGE,
  PRESET_VERSION,
  RULES,
  checkClassReferences,
  checkElement,
  checkImport,
  checkRawElement,
  checkTokenRef,
  findVarRefs,
  loadKnowledge,
  ruleDocsUrl,
} from './koobiq-core.mjs';

const DS_ENTRIES = new Set([
  DS_PACKAGE,
  `${DS_PACKAGE}/markdown`,
  `${DS_PACKAGE}/code-block`,
]);

const filenameOf = (context) => context.filename ?? context.getFilename?.();

const knowledgeFor = (context) => {
  const file = filenameOf(context);

  if (!file || file === '<input>' || file === '<text>') return null;

  return loadKnowledge(path.dirname(file));
};

const isTestFile = (file = '') =>
  /(?:^|[\\/])(?:__tests__|__mocks__|tests?|e2e|stories)[\\/]|\.(?:test|spec|stories|e2e)\.[cm]?[jt]sx?$/.test(
    file
  );

const meta = (ids, schema = []) => ({
  type: 'problem',
  docs: {
    description: ids.map((id) => RULES[id]?.summary).join(' '),
    url: ruleDocsUrl(ids[0]),
  },
  schema,
  messages: { finding: '{{message}}' },
});

const reportAll = (context, node, findings) => {
  for (const found of findings) {
    context.report({
      node,
      messageId: 'finding',
      data: {
        message: found.suggestion
          ? `${found.message} ${found.suggestion}`
          : found.message,
      },
    });
  }
};

/* ---------------- fact builders (ESTree) ---------------- */

const stringValue = (node) => {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string')
    return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0)
    return node.quasis[0].value.cooked;

  return null;
};

const importFact = (node, kind) => {
  const source = stringValue(node.source);

  if (source == null) return null;

  const specifiers = (node.specifiers || []).map((spec) => {
    if (spec.type === 'ImportDefaultSpecifier')
      return { imported: 'default', local: spec.local.name, kind: 'default' };
    if (spec.type === 'ImportNamespaceSpecifier')
      return { imported: '*', local: spec.local.name, kind: 'namespace' };

    const imported = spec.imported ?? spec.local;

    return {
      imported: imported.name ?? imported.value,
      local: (spec.local ?? spec.exported)?.name,
      kind: 'named',
      typeOnly: spec.importKind === 'type' || spec.exportKind === 'type',
    };
  });

  return {
    source,
    kind,
    typeOnly: node.importKind === 'type' || node.exportKind === 'type',
    specifiers,
  };
};

const jsxName = (name) => {
  if (name.type === 'JSXIdentifier') return { root: name.name, member: null };

  if (name.type === 'JSXMemberExpression') {
    const parts = [];
    let current = name;

    while (current.type === 'JSXMemberExpression') {
      parts.unshift(current.property.name);
      current = current.object;
    }

    return { root: current.name, member: parts.join('.') };
  }

  return { root: `${name.namespace?.name}:${name.name?.name}`, member: null };
};

const attributeFact = (attr) => {
  const name =
    attr.name.type === 'JSXNamespacedName'
      ? `${attr.name.namespace.name}:${attr.name.name.name}`
      : attr.name.name;

  const value = attr.value;

  if (value == null) return { name, kind: 'boolean', value: 'true' };
  if (value.type === 'Literal')
    return {
      name,
      kind: typeof value.value === 'number' ? 'number' : 'literal',
      value: String(value.value),
    };

  const expression =
    value.type === 'JSXExpressionContainer' ? value.expression : value;

  const literal = stringValue(expression);

  if (literal != null) return { name, kind: 'literal', value: literal };

  if (expression?.type === 'Literal') {
    return {
      name,
      kind: typeof expression.value === 'number' ? 'number' : 'expression',
      value: String(expression.value),
    };
  }

  if (expression?.type === 'ObjectExpression') {
    return {
      name,
      kind: 'expression',
      value: '{…}',
      keys: expression.properties
        .map((p) =>
          p.type === 'Property' ? (p.key.name ?? p.key.value) : null
        )
        .filter(Boolean),
    };
  }

  return { name, kind: 'expression', value: '' };
};

const elementFact = (opening) => {
  const { root, member } = jsxName(opening.name);
  const attrs = [];
  let spread = false;

  for (const attr of opening.attributes) {
    if (attr.type === 'JSXSpreadAttribute') spread = true;
    else attrs.push(attributeFact(attr));
  }

  const parent = opening.parent;
  const children = parent?.type === 'JSXElement' ? parent.children : [];
  let hasChildren = false;
  let textChildren = '';

  for (const child of children) {
    if (child.type === 'JSXText') {
      if (child.value.trim()) {
        hasChildren = true;
        textChildren += child.value;
      }
    } else if (child.type === 'JSXExpressionContainer') {
      if (child.expression.type !== 'JSXEmptyExpression') hasChildren = true;
    } else {
      hasChildren = true;
    }
  }

  return {
    root,
    member,
    intrinsic: !member && /^[a-z]/.test(root),
    attrs,
    spread,
    hasChildren,
    textChildren: textChildren.trim(),
  };
};

/* ---------------- rule factories ---------------- */

const importRule = (ids, { withOptions = false } = {}) => ({
  meta: meta(
    ids,
    withOptions
      ? [
          {
            type: 'object',
            properties: { allow: { type: 'array', items: { type: 'string' } } },
            additionalProperties: false,
          },
        ]
      : []
  ),
  create(context) {
    const knowledge = knowledgeFor(context);
    const allow = context.options?.[0]?.allow || [];
    const config = { uiKits: { allow }, icons: { allow } };

    const check = (node, kind) => {
      const fact = importFact(node, kind);

      if (!fact) return;

      const findings = checkImport(fact, {
        knowledge: knowledge || {},
        config,
      }).filter((f) => ids.includes(f.id));

      for (const found of findings) {
        // Point at the specifier ("Select," in a multi-line import) when known.
        const target =
          found.specifier &&
          (node.specifiers || []).find(
            (s) =>
              (s.imported?.name ?? s.imported?.value ?? s.local?.name) ===
              found.specifier
          );

        reportAll(context, target || node, [found]);
      }
    };

    return {
      ImportDeclaration: (node) =>
        check(node, node.specifiers.length ? 'static' : 'side-effect'),
      ExportNamedDeclaration: (node) => node.source && check(node, 'reexport'),
      ExportAllDeclaration: (node) => check(node, 'reexport'),
      ImportExpression: (node) =>
        check({ source: node.source, specifiers: [] }, 'dynamic'),
    };
  },
});

/** Rules that need the DS bindings of the file to resolve JSX names. */
const elementRule = (ids, { raw = false } = {}) => ({
  meta: meta(ids),
  create(context) {
    const knowledge = knowledgeFor(context);
    const bindings = new Map();

    if (!knowledge?.ds && !raw) return {};

    return {
      ImportDeclaration(node) {
        const source = stringValue(node.source);

        if (!DS_ENTRIES.has(source) || node.importKind === 'type') return;

        for (const spec of node.specifiers) {
          if (spec.type === 'ImportNamespaceSpecifier')
            bindings.set(spec.local.name, { namespace: true });
          else if (
            spec.type === 'ImportSpecifier' &&
            spec.importKind !== 'type'
          ) {
            bindings.set(spec.local.name, {
              name: spec.imported.name ?? spec.imported.value,
            });
          }
        }
      },
      JSXOpeningElement(node) {
        const fact = elementFact(node);

        if (fact.intrinsic) {
          if (raw && !isTestFile(filenameOf(context))) {
            reportAll(
              context,
              node,
              checkRawElement(
                { tag: fact.root, attrs: fact.attrs },
                { knowledge: knowledge || {} }
              )
            );
          }

          return;
        }

        const binding = bindings.get(fact.root);

        if (!binding || raw) return;

        const dsName = binding.namespace
          ? fact.member
          : fact.member
            ? `${binding.name}.${fact.member}`
            : binding.name;

        if (!dsName) return;

        reportAll(
          context,
          node,
          checkElement({ ...fact, dsName }, { knowledge }).filter((f) =>
            ids.includes(f.id)
          )
        );
      },
    };
  },
});

const stringsRule = (ids, check) => ({
  meta: meta(ids),
  create(context) {
    const knowledge = knowledgeFor(context);

    if (!knowledge) return {};

    const visit = (node, text) => {
      if (!text || !text.includes('kbq-')) return;

      reportAll(
        context,
        node,
        check(text, knowledge).filter((f) => ids.includes(f.id))
      );
    };

    return {
      Literal: (node) =>
        typeof node.value === 'string' && visit(node, node.value),
      TemplateLiteral: (node) =>
        visit(node, node.quasis.map((q) => q.value.cooked).join('${}')),
    };
  },
});

const tokenCheck = (text, knowledge) =>
  findVarRefs(text).flatMap((ref) =>
    checkTokenRef(ref, { knowledge, tokenSet: 'none' })
  );

/* ---------------- plugin and configs ---------------- */

export const plugin = {
  meta: { name: 'koobiq', version: PRESET_VERSION },
  rules: {
    'no-deep-imports': importRule(['import/deep', 'import/unknown-export']),
    'no-internal-packages': importRule(['import/internal-layer']),
    'no-other-ui-kits': importRule(['import/other-ui-kit'], {
      withOptions: true,
    }),
    'no-other-icon-libraries': importRule(['import/other-icons'], {
      withOptions: true,
    }),
    'no-deprecated': {
      meta: meta([
        'deprecated/prop',
        'deprecated/component',
        'deprecated/export',
      ]),
      create(context) {
        const imports = importRule([
          'deprecated/component',
          'deprecated/export',
        ]).create(context);

        const elements = elementRule(['deprecated/prop']).create(context);

        return {
          ...imports,
          ImportDeclaration(node) {
            imports.ImportDeclaration?.(node);
            elements.ImportDeclaration?.(node);
          },
          JSXOpeningElement: (node) => elements.JSXOpeningElement?.(node),
        };
      },
    },
    'no-hashed-classes': stringsRule(
      ['style/hashed-class'],
      (text, knowledge) =>
        checkClassReferences(text, { knowledge }, { inSelector: false })
    ),
    'no-unknown-tokens': stringsRule(['token/unknown'], tokenCheck),
    'no-deprecated-tokens': stringsRule(
      ['token/deprecated', 'token/legacy-only'],
      tokenCheck
    ),
    'accessible-name': elementRule([
      'a11y/icon-button-label',
      'a11y/field-label',
    ]),
    'controlled-props': elementRule([
      'props/value-and-default',
      'props/controlled-without-handler',
    ]),
    'prefer-ds-components': elementRule(['component/raw-element'], {
      raw: true,
    }),
  },
};

const FILES = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'];

export const recommended = [
  { name: 'koobiq/ignores', ignores: ['.koobiq/**'] },
  {
    name: 'koobiq/recommended',
    files: FILES,
    plugins: { koobiq: plugin },
    rules: {
      'koobiq/no-deep-imports': 'error',
      'koobiq/no-internal-packages': 'warn',
      'koobiq/no-other-ui-kits': 'warn',
      'koobiq/no-other-icon-libraries': 'warn',
      'koobiq/no-deprecated': 'warn',
      'koobiq/no-hashed-classes': 'error',
      'koobiq/no-unknown-tokens': 'error',
      'koobiq/no-deprecated-tokens': 'warn',
      'koobiq/accessible-name': 'warn',
      'koobiq/controlled-props': 'warn',
    },
  },
  {
    name: 'koobiq/tests',
    files: ['**/*.{test,spec,stories}.{js,jsx,ts,tsx}', '**/__tests__/**'],
    rules: { 'koobiq/no-hashed-classes': 'warn' },
  },
];

export const strict = [
  ...recommended,
  {
    name: 'koobiq/strict',
    files: FILES,
    rules: { 'koobiq/prefer-ds-components': 'warn' },
  },
];

// Only when the project already lints with type information
// (parserOptions.projectService): it also flags deprecated APIs of other
// libraries, and misses the Koobiq props the d.ts inlines without JSDoc —
// koobiq/no-deprecated covers those.
export const typed = [
  {
    name: 'koobiq/typed',
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: { '@typescript-eslint/no-deprecated': 'warn' },
  },
];

export default recommended;
