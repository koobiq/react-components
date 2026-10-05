import fs from 'node:fs';

export const USAGE = `koobiq-check — deterministic Koobiq design-system checks for product code

Usage: node koobiq-check.mjs [options]

Scope (default: every tracked file):
  --root <dir>             Project root (default: current directory)
  --files <a,b,...>        Only these files (repeatable)
  --files-from <file|->    Read file paths from a file (one per line) or stdin
  --changed                Files changed against the merge-base, plus untracked
  --base <ref>             Base ref for --changed (default: origin/HEAD, main, master)

Output:
  --format json|text       Output format (default: json; schema: koobiq-check.schema.json)
  --out <file>             Write the report to a file; print a short summary
  --inventory full|summary|none   Component inventory detail
  --max-findings <n>       Cap on findings (default: 2000)
  --max-per-file <n>       Cap on findings per file (default: 30)
  --fail-on error|warning  Exit with 1 when findings reach this severity

Knowledge:
  --ds-dir <dir>           Use this @koobiq/react-components install
  --tokens-dir <dir>       Use this @koobiq/design-tokens install
  --icons-dir <dir>        Use this @koobiq/react-icons install
  --typescript <path>      Path to the typescript package to parse with
  --typecheck              Also ask the TypeScript language service for deprecations
  --config <file>          Config file (default: <root>/.koobiq/check.json)
  --only <categories>      Only these rule categories (comma-separated)

Other:
  --list-rules             Print the rule catalog as JSON
  --version                Print the tool version
  --help                   Show this help
`;

const VALUE_FLAGS = new Set([
  'root',
  'files',
  'files-from',
  'base',
  'format',
  'out',
  'inventory',
  'max-findings',
  'max-per-file',
  'fail-on',
  'ds-dir',
  'tokens-dir',
  'icons-dir',
  'typescript',
  'config',
  'only',
]);

const BOOLEAN_FLAGS = new Set([
  'changed',
  'typecheck',
  'list-rules',
  'version',
  'help',
]);

export class UsageError extends Error {}

const positiveInteger = (flag, value) => {
  const n = Number(value);

  if (!Number.isInteger(n) || n <= 0) {
    throw new UsageError(`--${flag} must be a positive integer`);
  }

  return n;
};

const readStdin = () => {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
};

/** Parses argv into options. Throws UsageError on invalid input. */
export function parseArgs(argv) {
  const options = {
    root: process.cwd(),
    files: [],
    changed: false,
    format: 'json',
    inventory: null,
    maxFindings: 2000,
    maxPerFile: 30,
    only: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith('--'))
      throw new UsageError(`Unexpected argument: ${arg}`);

    const [flag, inline] = arg.slice(2).split(/=(.*)/s);

    if (BOOLEAN_FLAGS.has(flag)) {
      options[flag.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = true;
      continue;
    }

    if (!VALUE_FLAGS.has(flag))
      throw new UsageError(`Unknown option: --${flag}`);

    let value = inline;

    if (value === undefined) {
      i += 1;
      value = argv[i];
    }

    if (value === undefined) throw new UsageError(`--${flag} needs a value`);

    switch (flag) {
      case 'files':
        options.files.push(
          ...value
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean)
        );

        break;

      case 'files-from': {
        const text =
          value === '-' ? readStdin() : fs.readFileSync(value, 'utf8');

        options.files.push(
          ...text
            .split(/\r?\n/)
            .map((f) => f.trim())
            .filter(Boolean)
        );

        options.filesFrom = value;
        break;
      }

      case 'format':
        if (!['json', 'text'].includes(value))
          throw new UsageError('--format must be json or text');
        options.format = value;
        break;
      case 'inventory':
        if (!['full', 'summary', 'none'].includes(value)) {
          throw new UsageError('--inventory must be full, summary or none');
        }

        options.inventory = value;
        break;
      case 'fail-on':
        if (!['error', 'warning'].includes(value))
          throw new UsageError('--fail-on must be error or warning');
        options.failOn = value;
        break;
      case 'max-findings':
        options.maxFindings = positiveInteger(flag, value);
        break;
      case 'max-per-file':
        options.maxPerFile = positiveInteger(flag, value);
        break;

      case 'only':
        options.only = value
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);

        break;
      default:
        options[flag.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = value;
    }
  }

  if (options.changed && options.files.length) {
    throw new UsageError(
      '--changed cannot be combined with --files / --files-from'
    );
  }

  return options;
}
