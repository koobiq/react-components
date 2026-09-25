/**
 * Runs `pnpm e2e:components` in Docker, the environment the screenshot baselines belong to.
 *
 *   node tools/e2e/run.mjs                      # the whole suite
 *   node tools/e2e/run.mjs -g Button            # arguments go to `pnpm e2e:components`
 *   node tools/e2e/run.mjs --update-snapshots   # rewrite changed and missing baselines
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));

// From the manifest: CI runs this without installing the dependencies.
const { devDependencies } = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
);

const version = devDependencies['@playwright/test'];

// The image tag has to match the installed browsers, so a range will not do.
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(
    `Expected an exact @playwright/test version in package.json, got "${version}".`
  );

  process.exit(1);
}

const args = process.argv.slice(2);

const isUpdate = args.some(
  (arg) => arg === '-u' || arg.startsWith('--update-snapshots')
);

const composeFiles = [
  'tools/e2e/docker-compose.yml',
  ...(isUpdate ? ['tools/e2e/docker-compose.update.yml'] : []),
];

// Compose would create a missing bind-mount source owned by root.
for (const dir of ['playwright-report', 'test-results']) {
  mkdirSync(new URL(`../../${dir}`, import.meta.url), { recursive: true });
}

const { status, error } = spawnSync(
  'docker',
  [
    'compose',
    ...composeFiles.flatMap((file) => ['--file', file]),
    'run',
    '--rm',
    '--build',
    'e2e',
    'pnpm',
    'e2e:components',
    ...args,
  ],
  {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_VERSION: version },
  }
);

if (error) {
  console.error(`Could not run docker: ${error.message}`);
} else if (status !== 0) {
  console.info('To view the report, run `pnpm exec playwright show-report`.');
}

process.exit(status ?? 1);
