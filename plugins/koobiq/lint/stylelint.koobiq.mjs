// Koobiq design-system rules for Stylelint >= 16 (CSS, SCSS, Less, CSS-in-JS
// syntaxes). Copied into products by /koobiq:setup-lint next to
// koobiq-core.mjs.
//
//   // stylelint.config.mjs
//   export default { extends: ['./.koobiq/stylelint.koobiq.mjs'] };
import path from 'node:path';

import stylelint from 'stylelint';

import {
  RULES,
  checkClassReferences,
  checkDeclaration,
  checkScssVariable,
  checkTokenDef,
  checkTokenRef,
  findScssTokenVars,
  findVarRefs,
  loadKnowledge,
  ruleDocsUrl,
} from './koobiq-core.mjs';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const THEME_SELECTOR_RE =
  /\.kbq-(?:light|dark)\b|\[data-theme|prefers-color-scheme/;

const VENDORED_THRESHOLD = 200;

const selectorChain = (node) => {
  const chain = [];
  let current = node.parent;

  while (current && current.type !== 'root') {
    if (current.type === 'rule') chain.unshift(current.selector);
    else if (current.type === 'atrule')
      chain.unshift(`@${current.name} ${current.params}`);
    current = current.parent;
  }

  return chain;
};

const makeRule = (name, ids, run) => {
  const ruleName = `koobiq/${name}`;
  const messages = ruleMessages(ruleName, { finding: (message) => message });

  const ruleFunction = (primary) => (root, result) => {
    if (
      !validateOptions(result, ruleName, { actual: primary, possible: [true] })
    )
      return;

    const file = root.source?.input?.file || result.opts?.from;

    if (!file) return;

    const knowledge = loadKnowledge(path.dirname(file));

    if (!knowledge.tokens && !knowledge.ds) return;

    run(root, knowledge, (node, findings) => {
      for (const found of findings) {
        if (!ids.includes(found.id)) continue;

        report({
          ruleName,
          result,
          node,
          message: messages.finding(
            found.suggestion
              ? `${found.message} ${found.suggestion}`
              : found.message
          ),
        });
      }
    });
  };

  ruleFunction.ruleName = ruleName;
  ruleFunction.messages = messages;

  ruleFunction.meta = {
    url: ruleDocsUrl(ids[0]),
    description: RULES[ids[0]]?.summary,
  };

  return createPlugin(ruleName, ruleFunction);
};

const isVendored = (root) => {
  let count = 0;

  root.walkDecls(/^--kbq-/, () => {
    count += 1;
  });

  return count > VENDORED_THRESHOLD;
};

const tokenRefs = (root, knowledge, emit) => {
  root.walkDecls((decl) => {
    for (const ref of findVarRefs(decl.value)) {
      emit(decl, checkTokenRef(ref, { knowledge, tokenSet: 'none' }));
    }
  });
};

export const plugins = [
  makeRule('no-unknown-tokens', ['token/unknown'], tokenRefs),
  makeRule(
    'no-deprecated-tokens',
    ['token/deprecated', 'token/legacy-only'],
    tokenRefs
  ),
  makeRule(
    'no-unknown-public-vars',
    ['token/defines-unknown-public-var'],
    (root, knowledge, emit) => {
      if (isVendored(root)) return;

      root.walkDecls(/^--kbq-/, (decl) => {
        emit(decl, checkTokenDef({ name: decl.prop }, { knowledge }));
      });
    }
  ),
  makeRule(
    'no-hashed-classes',
    ['style/hashed-class'],
    (root, knowledge, emit) => {
      root.walkRules((rule) => {
        emit(
          rule,
          checkClassReferences(
            rule.selector,
            { knowledge },
            { inSelector: true }
          )
        );
      });
    }
  ),
  makeRule(
    'prefer-color-tokens',
    ['style/hardcoded-color'],
    (root, knowledge, emit) => {
      root.walkDecls((decl) => {
        if (decl.prop.startsWith('--') || decl.prop.startsWith('$')) return;

        const chain = selectorChain(decl);

        const findings = checkDeclaration(
          {
            prop: decl.prop,
            value: decl.value,
            important: decl.important,
            selector: chain.join(' '),
            inThemeBlock: chain.some((s) => THEME_SELECTOR_RE.test(s)),
          },
          { knowledge }
        );

        // Only exact token matches: other literal colors need a human choice.
        emit(
          decl,
          findings.filter(
            (f) => f.id === 'style/hardcoded-color' && f.severity === 'warning'
          )
        );
      });
    }
  ),
  makeRule(
    'no-static-token-variables',
    ['token/scss-static-variable'],
    (root, knowledge, emit) => {
      root.walkDecls((decl) => {
        for (const variable of findScssTokenVars(decl.value)) {
          emit(decl, checkScssVariable(variable.name));
        }
      });
    }
  ),
];

export default {
  plugins,
  rules: {
    'koobiq/no-unknown-tokens': true,
    'koobiq/no-deprecated-tokens': [true, { severity: 'warning' }],
    'koobiq/no-unknown-public-vars': [true, { severity: 'warning' }],
    'koobiq/no-hashed-classes': true,
    'koobiq/prefer-color-tokens': [true, { severity: 'warning' }],
    'koobiq/no-static-token-variables': [true, { severity: 'warning' }],
  },
};
