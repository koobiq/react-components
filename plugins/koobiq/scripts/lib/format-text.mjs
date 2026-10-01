const colorEnabled = () => process.stdout.isTTY && !process.env.NO_COLOR;

const paint = (code, text) =>
  colorEnabled() ? `\u001b[${code}m${text}\u001b[0m` : text;

const SEVERITY_STYLE = { error: '31', warning: '33', info: '36' };

/** Human-readable report, grouped by file. */
export function formatText(report, { limit } = {}) {
  const { meta, findings } = report;
  const lines = [];

  const header = [
    `koobiq-check ${report.tool.version}`,
    meta.dsVersion ? `DS ${meta.dsVersion}` : 'DS not installed',
    meta.tokensVersion
      ? `tokens ${meta.tokensVersion} (set: ${meta.tokenSet})`
      : null,
    meta.typescript
      ? `TS ${meta.typescriptVersion} (${meta.tsTier})`
      : 'no TypeScript (regex tier)',
    `${meta.filesScanned} files${meta.mode === 'changed' ? ` (changed vs ${meta.base})` : ''}`,
    `${(meta.durationMs / 1000).toFixed(1)} s`,
  ].filter(Boolean);

  lines.push(header.join(' · '));

  const shown = limit ? findings.slice(0, limit) : findings;
  let currentFile = null;

  for (const finding of shown) {
    if (finding.file !== currentFile) {
      currentFile = finding.file;
      lines.push('', paint('4', finding.file));
    }

    const position = `${finding.line}:${finding.column}`.padEnd(8);

    const severity = paint(
      SEVERITY_STYLE[finding.severity],
      finding.severity.padEnd(8)
    );

    lines.push(
      `  ${position} ${severity} ${finding.id.padEnd(34)} ${finding.message}`
    );

    if (finding.suggestion)
      lines.push(
        `  ${' '.repeat(8)} ${' '.repeat(8)} ${paint('2', `→ ${finding.suggestion}`)}`
      );
  }

  if (limit && findings.length > limit)
    lines.push(
      '',
      `… ${findings.length - limit} more findings in the JSON report.`
    );

  const { counts } = meta;

  const skipped = meta.skipped
    .map((s) => `${s.check} (${s.reason})`)
    .join(', ');

  lines.push(
    '',
    [
      `${counts.error} error${counts.error === 1 ? '' : 's'}`,
      `${counts.warning} warning${counts.warning === 1 ? '' : 's'}`,
      `${counts.info} info`,
      `${meta.suppressed} suppressed`,
      skipped ? `skipped: ${skipped}` : null,
    ]
      .filter(Boolean)
      .join(' · ')
  );

  return lines.join('\n');
}
