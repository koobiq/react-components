import {
  RULES,
  componentDocsId,
  docsUrl,
  isRuleEnabled,
  resolveSeverity,
  ruleDocsUrl,
} from '../../lint/koobiq-core.mjs';

import { inChangedLines } from './discover.mjs';
import { isTestFile, lineAt, positionAt, sha1, truncate } from './util.mjs';

const SEVERITY_RANK = { error: 0, warning: 1, info: 2 };
const DOWNGRADE = { error: 'warning', warning: 'info', info: 'info' };

// ESLint / Stylelint preset rule names → checker ids (for disable comments).
export const PRESET_RULE_IDS = {
  'no-deep-imports': ['import/deep', 'import/unknown-export'],
  'no-internal-packages': ['import/internal-layer'],
  'no-other-ui-kits': ['import/other-ui-kit'],
  'no-other-icon-libraries': ['import/other-icons'],
  'no-deprecated': [
    'deprecated/prop',
    'deprecated/component',
    'deprecated/export',
  ],
  'no-hashed-classes': ['style/hashed-class'],
  'no-unknown-tokens': ['token/unknown'],
  'no-deprecated-tokens': ['token/deprecated', 'token/legacy-only'],
  'no-unknown-public-vars': ['token/defines-unknown-public-var'],
  'prefer-color-tokens': ['style/hardcoded-color'],
  'no-static-token-variables': ['token/scss-static-variable'],
  'accessible-name': ['a11y/icon-button-label', 'a11y/field-label'],
  'controlled-props': [
    'props/value-and-default',
    'props/controlled-without-handler',
  ],
  'prefer-ds-components': ['component/raw-element'],
};

const matchesSelector = (id, selector) =>
  selector === id ||
  (selector.endsWith('/*') && id.startsWith(selector.slice(0, -1)));

const parseIdList = (raw) => {
  const list = raw
    .split('--')[0]
    .replace(/\*\/.*$/, '')
    .replace(/-->.*$/, '')
    .split(/[\s,]+/)
    .filter(Boolean);

  const ids = [];

  for (const item of list) {
    const preset = item.match(/^koobiq\/([\w-]+)$/);

    if (preset) ids.push(...(PRESET_RULE_IDS[preset[1]] || []));
    else if (/^[a-z0-9]+\/(?:[\w-]+|\*)$/.test(item)) ids.push(item);
  }

  return ids;
};

/** Collects inline suppressions of one file: { file: [ids] | null, lines: Map<line, ids[] | null> }. */
export function collectSuppressions(text) {
  const result = { file: undefined, lines: new Map() };
  const lines = text.split('\n');

  const record = (line, ids) => {
    const existing = result.lines.get(line);

    if (existing === null) return;
    result.lines.set(line, ids.length ? [...(existing || []), ...ids] : null);
  };

  lines.forEach((raw, index) => {
    const lineNo = index + 1;
    let match = raw.match(/koobiq-ignore-next-line\b(.*)/);

    if (match) record(lineNo + 1, parseIdList(match[1]));

    match = raw.match(/koobiq-ignore-line\b(.*)/);
    if (match) record(lineNo, parseIdList(match[1]));

    match = raw.match(/(?:eslint|stylelint)-disable-next-line\s+(.*)/);

    if (match) {
      const ids = parseIdList(match[1]);

      if (ids.length) record(lineNo + 1, ids);
    }

    match = raw.match(/(?:eslint|stylelint)-disable-line\s+(.*)/);

    if (match) {
      const ids = parseIdList(match[1]);

      if (ids.length) record(lineNo, ids);
    }

    if (lineNo <= 10) {
      match = raw.match(/koobiq-ignore-file\b(.*)/);

      if (match) {
        const ids = parseIdList(match[1]);

        result.file = ids.length ? ids : null;
      }
    }
  });

  return result;
}

const isSuppressed = (suppressions, finding) => {
  if (!suppressions) return false;

  const fileRule = suppressions.file;

  if (fileRule === null) return true;
  if (fileRule && fileRule.some((s) => matchesSelector(finding.id, s)))
    return true;

  if (!suppressions.lines.has(finding.line)) return false;

  const ids = suppressions.lines.get(finding.line);

  return ids === null || ids.some((s) => matchesSelector(finding.id, s));
};

const configSeverity = (id, rules = {}) => {
  if (rules[id]) return rules[id];

  const category = `${id.split('/')[0]}/*`;

  return rules[category];
};

/**
 * Positions, filters, suppresses, dedupes, caps and fingerprints raw
 * findings. `sources` maps file → { text, starts }.
 */
export function finalizeFindings(raw, options) {
  const {
    sources,
    changedLines,
    config = {},
    only,
    maxPerFile = 30,
    maxFindings = 2000,
  } = options;

  const ruleConfig = config.rules || {};
  const suppressionCache = new Map();
  const seen = new Set();
  const kept = [];
  let suppressed = 0;

  for (const item of raw) {
    const rule = RULES[item.id];
    const category = rule?.category || item.id.split('/')[0];

    if (only && !only.includes(category)) continue;

    const configured = configSeverity(item.id, ruleConfig);

    if (configured === 'off') continue;
    if (!configured && !isRuleEnabled(item.id)) continue;

    const source = sources.get(item.file);
    let { line, column } = item;

    if (item.offset != null && source)
      ({ line, column } = positionAt(source.starts, item.offset));

    line = line || 1;
    column = column || 1;

    if (source) {
      if (!suppressionCache.has(item.file))
        suppressionCache.set(item.file, collectSuppressions(source.text));

      if (
        isSuppressed(suppressionCache.get(item.file), { id: item.id, line })
      ) {
        suppressed += 1;
        continue;
      }
    }

    let severity = configured || resolveSeverity(item);

    if (!configured && isTestFile(item.file)) severity = DOWNGRADE[severity];

    const key = `${item.id}|${item.file}|${line}|${column}|${item.message}`;

    if (seen.has(key)) continue;
    seen.add(key);

    const component = item.data?.component;

    const docs =
      item.docs ||
      (component &&
      (item.id.startsWith('deprecated/') || item.id.startsWith('props/'))
        ? docsUrl(componentDocsId(component))
        : ruleDocsUrl(item.id));

    kept.push({
      id: item.id,
      category,
      severity,
      file: item.file,
      line,
      column,
      message: item.message,
      evidence: source
        ? truncate(lineAt(source.text, source.starts, line))
        : undefined,
      ...(item.suggestion && { suggestion: item.suggestion }),
      ...(docs && { docs }),
      confidence: item.confidence || 'high',
      source: item.source || (item.offset != null ? 'ast' : 'project'),
      ...(changedLines &&
        item.offset != null && {
          inDiff: inChangedLines(changedLines, item.file, line),
        }),
      fixable: item.fixable || 'manual',
      ...(item.fix && { fix: item.fix }),
      ...(item.data && { data: item.data }),
    });
  }

  kept.sort(
    (a, b) =>
      a.file.localeCompare(b.file) ||
      a.line - b.line ||
      a.column - b.column ||
      a.id.localeCompare(b.id)
  );

  const truncated = new Map();
  const perFile = new Map();
  const capped = [];

  const byPriority = [...kept].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  );

  const allowed = new Set();

  for (const finding of byPriority) {
    const count = perFile.get(finding.file) || 0;

    if (count >= maxPerFile || allowed.size >= maxFindings) {
      truncated.set(finding.id, (truncated.get(finding.id) || 0) + 1);
      continue;
    }

    perFile.set(finding.file, count + 1);
    allowed.add(finding);
  }

  const occurrences = new Map();

  for (const finding of kept) {
    if (!allowed.has(finding)) continue;

    const base = `${finding.id}|${finding.file}|${(finding.evidence || '').replace(/\s+/g, ' ')}`;
    const n = occurrences.get(base) || 0;

    occurrences.set(base, n + 1);
    capped.push({ ...finding, fingerprint: sha1(`${base}|${n}`).slice(0, 16) });
  }

  const counts = { error: 0, warning: 0, info: 0 };

  for (const finding of capped) counts[finding.severity] += 1;

  return {
    findings: capped,
    counts,
    suppressed,
    truncated: [...truncated].map(([id, dropped]) => ({ id, dropped })),
  };
}
