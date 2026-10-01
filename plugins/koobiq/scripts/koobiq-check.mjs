#!/usr/bin/env node
// Deterministic Koobiq design-system checks for product code.
// Zero dependencies; TypeScript is borrowed from the product when present.
import fs from 'node:fs';
import path from 'node:path';

import { RULES } from '../lint/koobiq-core.mjs';

import { USAGE, UsageError, parseArgs } from './lib/cli.mjs';
import { TOOL_VERSION, runCheck } from './lib/engine.mjs';
import { formatText } from './lib/format-text.mjs';

const [major, minor] = process.versions.node.split('.').map(Number);

const fail = (code, message, format = 'json') => {
  if (format === 'json')
    process.stdout.write(
      `${JSON.stringify({ schemaVersion: 1, meta: { fatal: message } })}\n`
    );
  else process.stderr.write(`koobiq-check: ${message}\n`);
  process.exitCode = code;
};

function main() {
  if (major < 18 || (major === 18 && minor < 17)) {
    fail(2, `Node.js >= 18.17 is required (found ${process.versions.node}).`);

    return;
  }

  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`${error.message}\n\n${USAGE}`);
      process.exitCode = 2;

      return;
    }

    throw error;
  }

  if (options.help) {
    process.stdout.write(USAGE);

    return;
  }

  if (options.version) {
    process.stdout.write(`${TOOL_VERSION}\n`);

    return;
  }

  if (options.listRules) {
    process.stdout.write(`${JSON.stringify(RULES, null, 2)}\n`);

    return;
  }

  let report;

  try {
    report = runCheck(options);
  } catch (error) {
    fail(3, String(error?.stack || error), options.format);

    return;
  }

  const output =
    options.format === 'text'
      ? formatText(report)
      : JSON.stringify(report, null, 2);

  if (options.out) {
    const target = path.resolve(options.root || process.cwd(), options.out);

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${output}\n`);

    process.stdout.write(
      `${formatText(report, { limit: 15 })}\n\nFull report: ${target.split(path.sep).join('/')}\n`
    );
  } else {
    process.stdout.write(`${output}\n`);
  }

  const { counts } = report.meta;

  if (options.failOn === 'error' && counts.error > 0) process.exitCode = 1;
  if (options.failOn === 'warning' && counts.error + counts.warning > 0)
    process.exitCode = 1;
}

main();
