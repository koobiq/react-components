// Tolerant scanner for CSS / SCSS / LESS (and CSS inside tagged templates).
// It does not build a full AST: it finds selectors, declarations, imports,
// custom-property references/definitions and SCSS token variables with
// their character offsets, which is all the Koobiq checks need.

const THEME_SELECTOR_RE =
  /\.kbq-(?:light|dark)\b|\[data-theme|prefers-color-scheme/;

/** Replaces comments with spaces (keeping newlines) so offsets stay exact. */
export function maskComments(text, { lineComments = false } = {}) {
  const out = text.split('');
  let i = 0;
  let quote = null;
  let parenUrl = 0;

  const blank = (from, to) => {
    for (let k = from; k < to; k++)
      if (out[k] !== '\n' && out[k] !== '\r') out[k] = ' ';
  };

  while (i < text.length) {
    const char = text[i];

    if (quote) {
      if (char === '\\') i += 2;
      else {
        if (char === quote || char === '\n') quote = null;
        i += 1;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      i += 1;
      continue;
    }

    if (char === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;

      blank(i, stop);
      i = stop;
      continue;
    }

    if (lineComments && parenUrl === 0 && char === '/' && text[i + 1] === '/') {
      const end = text.indexOf('\n', i);
      const stop = end === -1 ? text.length : end;

      blank(i, stop);
      i = stop;
      continue;
    }

    if (text.startsWith('url(', i)) parenUrl += 1;
    else if (char === ')' && parenUrl > 0) parenUrl -= 1;

    i += 1;
  }

  return out.join('');
}

// Template placeholders are filled with "___", so a run of three
// underscores ends a name and marks it as dynamic.
export const VAR_REF_RE =
  /var\(\s*(--kbq-(?:[A-Za-z0-9-]|_(?!__))*)(\s*(?:#\{|@\{|\$\{|_{3,}))?(\s*,)?/g;

const SCSS_TOKEN_VAR_RE =
  /(?<![\w-])(?:[\w-]+\.)?\$((?:light|dark)-[a-z0-9-]+)/g;

const splitDeclaration = (statement) => {
  let depth = 0;
  let quote = null;

  for (let i = 0; i < statement.length; i++) {
    const char = statement[i];

    if (quote) {
      if (char === '\\') i += 1;
      else if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'") quote = char;
    else if (char === '(' || char === '[') depth += 1;
    else if (char === ')' || char === ']') depth -= 1;
    else if (char === '#' && statement[i + 1] === '{') {
      const end = statement.indexOf('}', i);

      if (end !== -1) i = end;
    } else if (char === ':' && depth === 0) {
      return i;
    }
  }

  return -1;
};

/**
 * Parses style text. `offset` shifts all reported offsets (used for CSS
 * embedded in tagged templates). Returns facts with absolute offsets.
 */
export function parseStyle(source, { syntax = 'css', offset = 0 } = {}) {
  const lineComments =
    syntax === 'scss' || syntax === 'less' || syntax === 'sass';

  const text = maskComments(source, { lineComments });

  const facts = {
    selectors: [],
    declarations: [],
    imports: [],
    varRefs: [],
    varDefs: [],
    scssVars: [],
  };

  if (syntax === 'sass') return parseIndentedSass(text, offset, facts);

  const stack = [];
  let statementStart = 0;
  let quote = null;
  let parens = 0;

  const chain = () =>
    stack.filter((entry) => !entry.atRule).map((entry) => entry.prelude);

  const inThemeBlock = () =>
    stack.some((entry) => THEME_SELECTOR_RE.test(entry.prelude));

  const scanValue = (value, valueOffset) => {
    for (const match of value.matchAll(VAR_REF_RE)) {
      const name = match[1];
      const dynamic = Boolean(match[2]);

      facts.varRefs.push({
        name: dynamic ? undefined : name,
        dynamicPrefix: dynamic ? name : undefined,
        hasFallback: Boolean(match[3]),
        offset: offset + valueOffset + match.index + match[0].indexOf('--'),
      });
    }

    if (syntax === 'scss') {
      for (const match of value.matchAll(SCSS_TOKEN_VAR_RE)) {
        facts.scssVars.push({
          name: `$${match[1]}`,
          offset: offset + valueOffset + match.index,
        });
      }
    }
  };

  const processStatement = (start, end) => {
    const raw = text.slice(start, end);
    const lead = raw.length - raw.trimStart().length;
    const statement = raw.trim();

    if (!statement) return;

    const at = start + lead;

    if (statement.startsWith('@')) {
      const imported = statement.match(
        /^@(?:import|use|forward)\s+(?:url\(\s*)?['"]?([^'")\s;]+)/
      );

      if (imported) {
        facts.imports.push({ source: imported[1], offset: offset + at });
      } else if (/^@[\w-]+\s*:/.test(statement)) {
        const colon = statement.indexOf(':');

        scanValue(statement.slice(colon + 1), at + colon + 1);
      }

      return;
    }

    const colon = splitDeclaration(statement);

    if (colon === -1) return;

    const prop = statement.slice(0, colon).trim();
    let value = statement.slice(colon + 1).trim();

    const valueOffset =
      at +
      colon +
      1 +
      (statement.slice(colon + 1).length -
        statement.slice(colon + 1).trimStart().length);

    const important = /!\s*important\s*$/i.test(value);

    if (important) value = value.replace(/!\s*important\s*$/i, '').trim();

    scanValue(statement.slice(colon + 1), at + colon + 1);

    if (prop.startsWith('$')) return;

    if (prop.startsWith('--kbq-')) {
      facts.varDefs.push({
        name: prop,
        offset: offset + at,
        chain: chain(),
        inThemeBlock: inThemeBlock(),
      });
    }

    facts.declarations.push({
      prop,
      value,
      important,
      offset: offset + at,
      valueOffset: offset + valueOffset,
      selector: chain().join(' '),
      inThemeBlock: inThemeBlock(),
    });
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (quote) {
      if (char === '\\') i += 1;
      else if (char === quote || char === '\n') quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if ((char === '#' || char === '@' || char === '$') && text[i + 1] === '{') {
      let depth = 0;

      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === '{') depth += 1;
        else if (text[j] === '}') {
          depth -= 1;

          if (depth === 0) {
            i = j;
            break;
          }
        }
      }

      continue;
    }

    if (char === '(') parens += 1;
    else if (char === ')') parens = Math.max(0, parens - 1);
    else if (parens > 0) continue;
    else if (char === '{') {
      const raw = text.slice(statementStart, i);
      const lead = raw.length - raw.trimStart().length;
      const prelude = raw.trim();
      const atRule = prelude.startsWith('@');

      stack.push({ prelude, atRule });

      if (!atRule && prelude) {
        facts.selectors.push({
          text: prelude,
          offset: offset + statementStart + lead,
        });
      }

      statementStart = i + 1;
    } else if (char === ';') {
      processStatement(statementStart, i);
      statementStart = i + 1;
    } else if (char === '}') {
      processStatement(statementStart, i);
      stack.pop();
      statementStart = i + 1;
    }
  }

  processStatement(statementStart, text.length);

  return facts;
}

/** Indented .sass syntax: line-based approximation. */
function parseIndentedSass(text, offset, facts) {
  let position = 0;
  const indentStack = [];

  for (const line of text.split('\n')) {
    const lineOffset = position;

    position += line.length + 1;

    const trimmed = line.trim();

    if (!trimmed) continue;

    const indent = line.length - line.trimStart().length;

    while (
      indentStack.length &&
      indentStack[indentStack.length - 1].indent >= indent
    )
      indentStack.pop();

    const at = lineOffset + indent;
    const decl = trimmed.match(/^([\w-]+|--[\w-]+)\s*:\s*(.+)$/);

    if (decl && !/^[&.#[:]/.test(trimmed)) {
      const value = decl[2].replace(/!\s*important\s*$/i, '').trim();
      const valueOffset = at + trimmed.indexOf(decl[2]);
      const selector = indentStack.map((entry) => entry.prelude).join(' ');

      for (const match of decl[2].matchAll(VAR_REF_RE)) {
        facts.varRefs.push({
          name: match[2] ? undefined : match[1],
          dynamicPrefix: match[2] ? match[1] : undefined,
          hasFallback: Boolean(match[3]),
          offset: offset + valueOffset + match.index + match[0].indexOf('--'),
        });
      }

      if (decl[1].startsWith('--kbq-')) {
        facts.varDefs.push({
          name: decl[1],
          offset: offset + at,
          chain: [selector],
          inThemeBlock: THEME_SELECTOR_RE.test(selector),
        });
      }

      facts.declarations.push({
        prop: decl[1],
        value,
        important: /!\s*important\s*$/i.test(decl[2]),
        offset: offset + at,
        valueOffset: offset + valueOffset,
        selector,
        inThemeBlock: THEME_SELECTOR_RE.test(selector),
      });
    } else if (trimmed.startsWith('@import') || trimmed.startsWith('@use')) {
      const imported = trimmed.match(/^@(?:import|use)\s+['"]?([^'"\s]+)/);

      if (imported)
        facts.imports.push({ source: imported[1], offset: offset + at });
    } else if (!trimmed.startsWith('@') && !trimmed.startsWith('$')) {
      indentStack.push({ indent, prelude: trimmed });
      facts.selectors.push({ text: trimmed, offset: offset + at });
    }
  }

  return facts;
}

export const styleSyntaxFor = (file) => {
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();

  if (ext === '.scss') return 'scss';
  if (ext === '.sass') return 'sass';
  if (ext === '.less') return 'less';

  return 'css';
};
