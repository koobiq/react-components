import {
  DS_PACKAGE,
  checkClassReferences,
  checkDeclaration,
  checkElement,
  checkImport,
  checkRawElement,
  checkTokenDef,
  checkTokenRef,
} from '../../../lint/koobiq-core.mjs';
import { VAR_REF_RE, parseStyle } from '../parse-style.mjs';

import { checkStyleFacts } from './style.mjs';

const TEXT_PROPS = new Set([
  'label',
  'caption',
  'placeholder',
  'aria-label',
  'title',
  'errorMessage',
  'description',
]);

const TEXT_CHILD_COMPONENTS = new Set([
  'Button',
  'Link',
  'Typography',
  'Badge',
  'Tag',
  'Alert',
]);

const MAX_I18N_PER_FILE = 10;
const MAX_DATE_PER_FILE = 5;

const DS_ENTRIES = new Set([
  DS_PACKAGE,
  `${DS_PACKAGE}/markdown`,
  `${DS_PACKAGE}/code-block`,
]);

/**
 * Checks one TS/JS file. Returns findings with absolute offsets and the
 * inventory of Koobiq components used in it.
 */
export function checkScriptFile(facts, ctx) {
  const findings = [];
  const components = [];
  const imports = [];
  const bindings = new Map();

  const add = (list, offset) => {
    for (const found of list)
      findings.push({ ...found, offset: offset + (found.index || 0) });
  };

  for (const imp of facts.imports) {
    const results = checkImport(imp, ctx);

    for (const found of results) {
      const spec =
        found.specifier &&
        imp.specifiers.find((s) => s.imported === found.specifier);

      findings.push({ ...found, offset: spec?.offset ?? imp.offset });
    }

    if (imp.source.startsWith('@koobiq/') || results.length) {
      imports.push({
        source: imp.source,
        specifiers: imp.specifiers.map(
          ({ imported, local, kind, typeOnly }) => ({
            name: imported,
            ...(local && local !== imported && { alias: local }),
            kind,
            ...(typeOnly && { typeOnly: true }),
          })
        ),
        offset: imp.offset,
      });
    }

    if (DS_ENTRIES.has(imp.source) && imp.kind !== 'reexport') {
      for (const spec of imp.specifiers) {
        if (spec.kind === 'named' && !spec.typeOnly)
          bindings.set(spec.local, { name: spec.imported, source: imp.source });
        if (spec.kind === 'namespace')
          bindings.set(spec.local, { namespace: true, source: imp.source });
      }
    } else if (
      ctx.resolveBarrel &&
      imp.kind === 'static' &&
      !imp.typeOnly &&
      !imp.source.startsWith('@koobiq/')
    ) {
      // T2: named imports from local barrels that re-export Koobiq.
      for (const spec of imp.specifiers) {
        if (spec.kind !== 'named' || spec.typeOnly) continue;

        const target = ctx.resolveBarrel(
          ctx.absFile,
          imp.source,
          spec.imported
        );

        if (!target) continue;
        if (target.wildcard && !ctx.knowledge?.ds?.exportIndex.has(target.name))
          continue;

        bindings.set(spec.local, {
          name: target.name,
          source: target.source,
          via: ctx.relative ? ctx.relative(target.via) : target.via,
        });
      }
    }
  }

  let i18nCount = 0;

  for (const element of facts.elements) {
    if (element.intrinsic) {
      if (ctx.usesDs && !ctx.isTest)
        add(checkRawElement(element, ctx), element.offset);
      continue;
    }

    const binding = bindings.get(element.root);

    if (!binding) continue;

    const dsName = binding.namespace
      ? element.member
      : element.member
        ? `${binding.name}.${element.member}`
        : binding.name;

    if (!dsName) continue;

    components.push({
      name: dsName,
      ...(element.root !== dsName.split('.')[0] &&
        !binding.namespace && { local: element.root }),
      source: binding.source,
      ...(binding.via && { via: binding.via }),
      offset: element.offset,
      props: element.attrs.map(({ name, kind, value }) => ({
        name,
        ...(kind === 'literal' || kind === 'number' ? { value } : {}),
      })),
      ...(element.spread && { spread: true }),
    });

    for (const found of checkElement({ ...element, dsName }, ctx)) {
      const attr =
        found.attr && element.attrs.find((a) => a.name === found.attr);

      findings.push({ ...found, offset: attr?.offset ?? element.offset });
    }

    if (ctx.hasI18n && i18nCount < MAX_I18N_PER_FILE && !ctx.isTest) {
      for (const attr of element.attrs) {
        if (
          TEXT_PROPS.has(attr.name) &&
          attr.kind === 'literal' &&
          /\p{L}{2,}/u.test(attr.value)
        ) {
          i18nCount += 1;

          findings.push({
            id: 'i18n/hardcoded-text',
            message: `Literal text in ${dsName} "${attr.name}" bypasses the app i18n library.`,
            confidence: 'medium',
            offset: attr.offset,
          });
        }
      }

      if (
        TEXT_CHILD_COMPONENTS.has(dsName) &&
        /\p{L}{2,}/u.test(element.textChildren || '')
      ) {
        i18nCount += 1;

        findings.push({
          id: 'i18n/hardcoded-text',
          message: `Literal text inside <${dsName}> bypasses the app i18n library.`,
          confidence: 'medium',
          offset: element.offset,
        });
      }
    }
  }

  for (const string of facts.strings) {
    add(
      checkClassReferences(string.text, ctx, { inSelector: false }),
      string.offset
    );

    if (!string.text.includes('--kbq-')) continue;

    for (const match of string.text.matchAll(VAR_REF_RE)) {
      const dynamic = Boolean(match[2]);

      const ref = {
        name: dynamic ? undefined : match[1],
        dynamicPrefix: dynamic ? match[1] : undefined,
        hasFallback: Boolean(match[3]),
      };

      add(
        checkTokenRef(ref, ctx),
        string.offset + match.index + match[0].indexOf('--')
      );
    }
  }

  for (const block of facts.styleBlocks) {
    findings.push(
      ...checkStyleFacts(
        parseStyle(block.text, { syntax: 'css', offset: block.offset }),
        ctx
      )
    );
  }

  for (const decl of facts.styleObjects) {
    if (decl.prop.startsWith('--kbq-')) {
      add(checkTokenDef({ name: decl.prop }, ctx), decl.offset);
      continue;
    }

    for (const found of checkDeclaration(
      { ...decl, selector: '', inThemeBlock: false },
      ctx
    )) {
      findings.push({
        ...found,
        offset:
          found.id === 'style/hardcoded-color' ? decl.valueOffset : decl.offset,
      });
    }
  }

  if (ctx.usesDs && bindings.size > 0 && !ctx.isTest) {
    for (const call of facts.dateCalls.slice(0, MAX_DATE_PER_FILE)) {
      findings.push({
        id: 'i18n/native-date-format',
        message: `Dates are formatted with ${call.kind}.`,
        suggestion:
          'Use @koobiq/date-formatter (or useDateFormatter from the DS) so dates follow the Provider locale and Koobiq formats.',
        confidence: 'medium',
        offset: call.offset,
      });
    }
  }

  return { findings, components, imports };
}
