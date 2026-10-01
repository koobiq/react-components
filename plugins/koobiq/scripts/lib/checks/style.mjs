import {
  checkClassReferences,
  checkDeclaration,
  checkImport,
  checkScssVariable,
  checkTokenDef,
  checkTokenRef,
} from '../../../lint/koobiq-core.mjs';

/**
 * Runs the style decisions over parse-style facts. Every finding carries
 * an absolute `offset` that the caller turns into line/column.
 */
export function checkStyleFacts(facts, ctx) {
  const findings = [];

  const add = (list, offset) => {
    for (const found of list)
      findings.push({ ...found, offset: offset + (found.index || 0) });
  };

  for (const imp of facts.imports) {
    add(
      checkImport(
        { source: imp.source, kind: 'css-import', specifiers: [] },
        ctx
      ),
      imp.offset
    );
  }

  for (const selector of facts.selectors) {
    add(
      checkClassReferences(selector.text, ctx, { inSelector: true }),
      selector.offset
    );
  }

  for (const decl of facts.declarations) {
    const results = checkDeclaration(decl, ctx);

    for (const found of results) {
      findings.push({
        ...found,
        offset:
          found.id === 'style/hardcoded-color' ? decl.valueOffset : decl.offset,
      });
    }
  }

  for (const ref of facts.varRefs) add(checkTokenRef(ref, ctx), ref.offset);

  for (const def of facts.varDefs) {
    if (def.inThemeBlock && ctx.vendored) continue;
    add(checkTokenDef(def, ctx), def.offset);
  }

  for (const scssVar of facts.scssVars)
    add(checkScssVariable(scssVar.name), scssVar.offset);

  return findings;
}
