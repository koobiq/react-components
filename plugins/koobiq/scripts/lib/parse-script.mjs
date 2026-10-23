// Turns TS/JS source into simple facts for the Koobiq checks.
// Tier T1 uses the product's TypeScript parser (createSourceFile only);
// tier T0 is a regex/JSX scanner for projects without TypeScript.
import { maskComments } from './parse-style.mjs';

const STYLED_TAG_RE =
  /^(?:css|keyframes|createGlobalStyle|injectGlobal|global|styled(?:\.[\w$]+|\([\s\S]*\))(?:\.attrs\([\s\S]*\))?)$/;

const DATE_LIBS = new Set(['moment', 'dayjs', 'date-fns', 'date-fns/format']);

const kebab = (name) =>
  name.startsWith('--')
    ? name
    : name
        .replace(
          /^(Webkit|Moz|ms|O)(?=[A-Z])/,
          (prefix) => `-${prefix.toLowerCase()}`
        )
        .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const scriptKindFor = (ts, file) => {
  const lower = file.toLowerCase();

  if (lower.endsWith('.tsx')) return ts.ScriptKind.TSX;

  if (
    lower.endsWith('.ts') ||
    lower.endsWith('.mts') ||
    lower.endsWith('.cts')
  ) {
    return ts.ScriptKind.TS;
  }

  return ts.ScriptKind.JSX;
};

/** Raw template text with `${…}` replaced by underscores (same length). */
const templateWithPlaceholders = (raw) => {
  const out = raw.split('');
  let i = 0;

  while (i < raw.length) {
    if (raw[i] === '\\') {
      i += 2;
      continue;
    }

    if (raw[i] === '$' && raw[i + 1] === '{') {
      let depth = 0;
      let j = i + 1;

      for (; j < raw.length; j++) {
        if (raw[j] === '{') depth += 1;
        else if (raw[j] === '}') {
          depth -= 1;
          if (depth === 0) break;
        }
      }

      for (let k = i; k <= j && k < raw.length; k++)
        if (out[k] !== '\n') out[k] = '_';
      i = j + 1;
      continue;
    }

    i += 1;
  }

  return out.join('');
};

const emptyFacts = (tier) => ({
  tier,
  imports: [],
  elements: [],
  strings: [],
  styleBlocks: [],
  styleObjects: [],
  dateCalls: [],
});

/** T1: TypeScript parser. */
export function parseScriptWithTs(text, file, ts) {
  const sf = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(ts, file)
  );

  const facts = emptyFacts('parser');
  const K = ts.SyntaxKind;
  const dateImports = new Map();

  const start = (node) => node.getStart(sf);

  const addImport = (source, kind, node, extra = {}) => {
    facts.imports.push({
      source,
      kind,
      offset: start(node),
      specifiers: [],
      ...extra,
    });

    return facts.imports[facts.imports.length - 1];
  };

  const visitImport = (node) => {
    if (!node.moduleSpecifier || node.moduleSpecifier.kind !== K.StringLiteral)
      return;

    const source = node.moduleSpecifier.text;
    const clause = node.importClause;

    if (!clause) {
      addImport(source, 'side-effect', node);

      return;
    }

    const entry = addImport(source, 'static', node, {
      typeOnly: Boolean(clause.isTypeOnly),
    });

    if (clause.name) {
      entry.specifiers.push({
        imported: 'default',
        local: clause.name.text,
        kind: 'default',
        typeOnly: Boolean(clause.isTypeOnly),
        offset: start(clause.name),
      });
    }

    const bindings = clause.namedBindings;

    if (bindings?.kind === K.NamespaceImport) {
      entry.specifiers.push({
        imported: '*',
        local: bindings.name.text,
        kind: 'namespace',
        typeOnly: Boolean(clause.isTypeOnly),
        offset: start(bindings),
      });
    } else if (bindings?.kind === K.NamedImports) {
      for (const element of bindings.elements) {
        entry.specifiers.push({
          imported: (element.propertyName || element.name).text,
          local: element.name.text,
          kind: 'named',
          typeOnly: Boolean(clause.isTypeOnly || element.isTypeOnly),
          offset: start(element),
        });
      }
    }

    if (DATE_LIBS.has(source)) {
      for (const spec of entry.specifiers) dateImports.set(spec.local, source);
    }
  };

  const visitExport = (node) => {
    if (!node.moduleSpecifier || node.moduleSpecifier.kind !== K.StringLiteral)
      return;

    const entry = addImport(node.moduleSpecifier.text, 'reexport', node, {
      typeOnly: Boolean(node.isTypeOnly),
    });

    if (node.exportClause?.kind === K.NamedExports) {
      for (const element of node.exportClause.elements) {
        entry.specifiers.push({
          imported: (element.propertyName || element.name).text,
          local: element.name.text,
          kind: 'named',
          typeOnly: Boolean(node.isTypeOnly || element.isTypeOnly),
          offset: start(element),
        });
      }
    }
  };

  const attributeFact = (attr) => {
    const name = attr.name.getText(sf);
    const init = attr.initializer;
    const fact = { name, offset: start(attr) };

    if (!init) return { ...fact, kind: 'boolean', value: 'true' };
    if (init.kind === K.StringLiteral)
      return { ...fact, kind: 'literal', value: init.text };

    const expression = init.kind === K.JsxExpression ? init.expression : init;

    if (!expression) return { ...fact, kind: 'expression', value: '' };

    switch (expression.kind) {
      case K.StringLiteral:
      case K.NoSubstitutionTemplateLiteral:
        return { ...fact, kind: 'literal', value: expression.text };
      case K.NumericLiteral:
        return { ...fact, kind: 'number', value: expression.text };
      case K.TrueKeyword:
        return { ...fact, kind: 'expression', value: 'true' };
      case K.FalseKeyword:
        return { ...fact, kind: 'expression', value: 'false' };
      case K.ObjectLiteralExpression:
        return {
          ...fact,
          kind: 'expression',
          value: '{…}',
          keys: expression.properties
            .map((p) =>
              p.name ? p.name.getText(sf).replace(/^['"]|['"]$/g, '') : null
            )
            .filter(Boolean),
          objectNode: expression,
        };
      default:
        return {
          ...fact,
          kind: 'expression',
          value: expression.getText(sf).slice(0, 80),
        };
    }
  };

  const tagParts = (tagName) => {
    if (tagName.kind === K.Identifier)
      return { root: tagName.text, member: null };

    if (tagName.kind === K.PropertyAccessExpression) {
      const text = tagName.getText(sf);
      const [root, ...rest] = text.split('.');

      return { root, member: rest.join('.') };
    }

    return { root: tagName.getText(sf), member: null };
  };

  const visitStyleObject = (objectNode) => {
    for (const property of objectNode.properties) {
      if (property.kind !== K.PropertyAssignment || !property.name) continue;

      const key = property.name.getText(sf).replace(/^['"]|['"]$/g, '');
      const init = property.initializer;
      let value = null;

      if (
        init.kind === K.StringLiteral ||
        init.kind === K.NoSubstitutionTemplateLiteral
      )
        value = init.text;
      else if (init.kind === K.NumericLiteral) value = init.text;
      else if (init.kind === K.TemplateExpression)
        value = templateWithPlaceholders(init.getText(sf).slice(1, -1));

      if (value == null) continue;

      facts.styleObjects.push({
        prop: kebab(key),
        value,
        offset: start(property),
        valueOffset: start(init) + (init.kind === K.NumericLiteral ? 0 : 1),
      });
    }
  };

  const visitJsx = (node, opening, children) => {
    const { root, member } = tagParts(opening.tagName);
    const intrinsic = !member && /^[a-z]/.test(root);
    const attrs = [];
    let spread = false;

    for (const property of opening.attributes.properties) {
      if (property.kind === K.JsxSpreadAttribute) {
        spread = true;
      } else {
        const fact = attributeFact(property);

        if (fact.name === 'style' && fact.objectNode)
          visitStyleObject(fact.objectNode);
        delete fact.objectNode;
        attrs.push(fact);
      }
    }

    let hasChildren = false;
    let textChildren = '';

    for (const child of children || []) {
      if (child.kind === K.JsxText) {
        if (!child.containsOnlyTriviaWhiteSpaces) {
          hasChildren = true;
          textChildren += child.text;
        }
      } else if (child.kind === K.JsxExpression) {
        if (child.expression) {
          hasChildren = true;
          if (child.expression.kind === K.StringLiteral)
            textChildren += child.expression.text;
        }
      } else {
        hasChildren = true;
      }
    }

    facts.elements.push({
      tag: intrinsic ? root : member ? `${root}.${member}` : root,
      intrinsic,
      root,
      member,
      attrs,
      spread,
      hasChildren,
      textChildren: textChildren.replace(/\s+/g, ' ').trim(),
      offset: start(opening),
    });
  };

  for (const statement of sf.statements) {
    if (statement.kind === K.ImportDeclaration) visitImport(statement);
  }

  const visit = (node) => {
    switch (node.kind) {
      case K.ImportDeclaration:
        break;
      case K.ExportDeclaration:
        visitExport(node);
        break;
      case K.JsxElement:
        visitJsx(node, node.openingElement, node.children);
        break;
      case K.JsxSelfClosingElement:
        visitJsx(node, node, []);
        break;
      case K.StringLiteral:
      case K.NoSubstitutionTemplateLiteral:
        if (
          node.parent?.kind !== K.ImportDeclaration &&
          node.parent?.kind !== K.ExportDeclaration
        ) {
          facts.strings.push({ text: node.text, offset: start(node) + 1 });
        }

        break;
      case K.TemplateExpression:
        if (node.parent?.kind !== K.TaggedTemplateExpression) {
          facts.strings.push({
            text: templateWithPlaceholders(node.getText(sf).slice(1, -1)),
            offset: start(node) + 1,
          });
        }

        break;

      case K.TaggedTemplateExpression: {
        const tag = node.tag.getText(sf).replace(/\s+/g, '');

        if (STYLED_TAG_RE.test(tag)) {
          facts.styleBlocks.push({
            text: templateWithPlaceholders(
              node.template.getText(sf).slice(1, -1)
            ),
            offset: start(node.template) + 1,
          });

          return;
        }

        break;
      }

      case K.CallExpression: {
        const callee = node.expression;

        if (
          callee.kind === K.ImportKeyword &&
          node.arguments[0]?.kind === K.StringLiteral
        ) {
          addImport(node.arguments[0].text, 'dynamic', node);
        } else if (
          callee.kind === K.Identifier &&
          callee.text === 'require' &&
          node.arguments[0]?.kind === K.StringLiteral
        ) {
          addImport(node.arguments[0].text, 'require', node);
        } else if (callee.kind === K.PropertyAccessExpression) {
          const method = callee.name.text;
          const receiver = callee.expression.getText(sf);

          if (
            method === 'toLocaleDateString' ||
            method === 'toLocaleTimeString'
          ) {
            facts.dateCalls.push({ kind: method, offset: start(node) });
          } else if (
            method === 'toLocaleString' &&
            /date|new Date/i.test(receiver)
          ) {
            facts.dateCalls.push({ kind: method, offset: start(node) });
          } else if (
            method === 'format' &&
            callee.expression.kind === K.CallExpression &&
            dateImports.has(callee.expression.expression.getText(sf))
          ) {
            facts.dateCalls.push({
              kind: `${dateImports.get(callee.expression.expression.getText(sf))} format`,
              offset: start(node),
            });
          }
        } else if (
          callee.kind === K.Identifier &&
          dateImports.get(callee.text)?.startsWith('date-fns')
        ) {
          if (callee.text === 'format' || callee.text.startsWith('format')) {
            facts.dateCalls.push({
              kind: 'date-fns format',
              offset: start(node),
            });
          }
        }

        break;
      }

      case K.NewExpression:
        if (/^Intl\.DateTimeFormat$/.test(node.expression.getText(sf))) {
          facts.dateCalls.push({
            kind: 'Intl.DateTimeFormat',
            offset: start(node),
          });
        }

        break;
      default:
        break;
    }

    ts.forEachChild(node, visit);
  };

  visit(sf);

  return facts;
}

/* ------------------------------------------------------------------ */
/* T0: regex / JSX scanner                                             */
/* ------------------------------------------------------------------ */

const parseSpecifiers = (clause) => {
  const specifiers = [];
  const trimmed = clause.trim();
  const named = trimmed.match(/\{([\s\S]*)\}/);

  const head = trimmed
    .replace(/\{[\s\S]*\}/, '')
    .replace(/,\s*$/, '')
    .trim();

  if (head.startsWith('*')) {
    specifiers.push({
      imported: '*',
      local: head.split(/\s+as\s+/)[1]?.trim(),
      kind: 'namespace',
    });
  } else if (head) {
    specifiers.push({
      imported: 'default',
      local: head.replace(/,$/, '').trim(),
      kind: 'default',
    });
  }

  if (named) {
    for (const part of named[1].split(',')) {
      const clean = part.trim();

      if (!clean) continue;

      const typeOnly = /^type\s+/.test(clean);
      const [imported, local] = clean.replace(/^type\s+/, '').split(/\s+as\s+/);

      specifiers.push({
        imported: imported.trim(),
        local: (local || imported).trim(),
        kind: 'named',
        typeOnly,
      });
    }
  }

  return specifiers;
};

const JSX_PREFIX_RE = /(?:^|[(,=?:{}\]>&|!;]|return|=>)\s*$/;

const readAttributes = (text, from) => {
  const attrs = [];
  let spread = false;
  let i = from;

  while (i < text.length) {
    while (/\s/.test(text[i] || '')) i += 1;

    if (text[i] === '/' && text[i + 1] === '>')
      return { attrs, spread, end: i + 2, selfClosing: true };
    if (text[i] === '>')
      return { attrs, spread, end: i + 1, selfClosing: false };

    if (text[i] === '{') {
      let depth = 0;
      const begin = i;

      for (; i < text.length; i++) {
        if (text[i] === '{') depth += 1;
        else if (text[i] === '}') {
          depth -= 1;
          if (depth === 0) break;
        }
      }

      if (/^\{\s*\.\.\./.test(text.slice(begin, i + 1))) spread = true;
      i += 1;
      continue;
    }

    const name = text.slice(i).match(/^[A-Za-z_$][\w$:.-]*/);

    if (!name) return { attrs, spread, end: i + 1, selfClosing: false };

    const offset = i;

    i += name[0].length;

    while (/\s/.test(text[i] || '')) i += 1;

    if (text[i] !== '=') {
      attrs.push({ name: name[0], kind: 'boolean', value: 'true', offset });
      continue;
    }

    i += 1;
    while (/\s/.test(text[i] || '')) i += 1;

    if (text[i] === '"' || text[i] === "'") {
      const quote = text[i];
      const end = text.indexOf(quote, i + 1);

      attrs.push({
        name: name[0],
        kind: 'literal',
        value: text.slice(i + 1, end),
        offset,
      });

      i = end + 1;
    } else if (text[i] === '{') {
      let depth = 0;
      const begin = i;

      for (; i < text.length; i++) {
        if (text[i] === '{') depth += 1;
        else if (text[i] === '}') {
          depth -= 1;
          if (depth === 0) break;
        }
      }

      const inner = text.slice(begin + 1, i).trim();
      const literal = inner.match(/^(['"`])([^'"`]*)\1$/);

      const keys = /^\{[\s\S]*\}$/.test(inner)
        ? [
            ...inner
              .slice(1, -1)
              .matchAll(/(?:^|,)\s*['"]?([\w$-]+)['"]?\s*:/g),
          ].map((m) => m[1])
        : undefined;

      attrs.push({
        name: name[0],
        kind: literal
          ? 'literal'
          : /^\d+(?:\.\d+)?$/.test(inner)
            ? 'number'
            : 'expression',
        value: literal ? literal[2] : inner.slice(0, 80),
        keys,
        offset,
      });

      i += 1;
    }
  }

  return { attrs, spread, end: text.length, selfClosing: true };
};

/** T0: no TypeScript available. Approximate but dependency-free. */
export function parseScriptWithRegex(source) {
  const text = maskComments(source, { lineComments: true });
  const facts = emptyFacts('regex');

  const importRe =
    /\bimport\s+(type\s+)?([\w$*{},\s]+?)\s+from\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]|\bexport\s+(type\s+)?(\{[^}]*\}|\*(?:\s+as\s+[\w$]+)?)\s+from\s*['"]([^'"]+)['"]|\brequire\(\s*['"]([^'"]+)['"]\s*\)|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const match of text.matchAll(importRe)) {
    if (match[3]) {
      facts.imports.push({
        source: match[3],
        kind: 'static',
        typeOnly: Boolean(match[1]),
        specifiers: parseSpecifiers(match[2]),
        offset: match.index,
      });
    } else if (match[4]) {
      facts.imports.push({
        source: match[4],
        kind: 'side-effect',
        specifiers: [],
        offset: match.index,
      });
    } else if (match[7]) {
      facts.imports.push({
        source: match[7],
        kind: 'reexport',
        typeOnly: Boolean(match[5]),
        specifiers: match[6].startsWith('{') ? parseSpecifiers(match[6]) : [],
        offset: match.index,
      });
    } else if (match[8] || match[9]) {
      facts.imports.push({
        source: match[8] || match[9],
        kind: match[8] ? 'require' : 'dynamic',
        specifiers: [],
        offset: match.index,
      });
    }
  }

  for (const match of text.matchAll(
    /<([A-Za-z][\w$]*(?:\.[\w$]+)*)(?=[\s/>])/g
  )) {
    if (
      !JSX_PREFIX_RE.test(
        text.slice(Math.max(0, match.index - 12), match.index)
      )
    )
      continue;

    const [root, ...rest] = match[1].split('.');
    const member = rest.join('.') || null;

    const { attrs, spread, end, selfClosing } = readAttributes(
      text,
      match.index + match[0].length
    );

    const after = selfClosing
      ? ''
      : text.slice(
          end,
          text.indexOf('<', end) === -1 ? end : text.indexOf('<', end)
        );

    const nextTag = selfClosing
      ? ''
      : text.slice(text.indexOf('<', end), text.indexOf('<', end) + 2);

    facts.elements.push({
      tag: match[1],
      intrinsic: !member && /^[a-z]/.test(root),
      root,
      member,
      attrs,
      spread,
      hasChildren:
        !selfClosing &&
        (after.trim() !== '' || (nextTag !== '</' && nextTag !== '')),
      textChildren: after
        .replace(/\{[^}]*\}/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
      offset: match.index,
    });
  }

  for (const match of text.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
    facts.strings.push({ text: match[2], offset: match.index + 1 });
  }

  for (const match of text.matchAll(
    /\b(?:css|createGlobalStyle|keyframes|styled\.[\w$]+|styled\([^)]*\))`/g
  )) {
    const begin = match.index + match[0].length;
    const end = text.indexOf('`', begin);

    if (end !== -1) {
      facts.styleBlocks.push({
        text: templateWithPlaceholders(source.slice(begin, end)),
        offset: begin,
      });
    }
  }

  return facts;
}

export function parseScript(text, file, ts) {
  if (ts?.createSourceFile) {
    try {
      return parseScriptWithTs(text, file, ts);
    } catch {
      // fall through to the regex tier
    }
  }

  return parseScriptWithRegex(text);
}
