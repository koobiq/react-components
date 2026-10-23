// Checks that a change to the Claude Code plugin bumps its version and adds
// a section to plugins/koobiq/CHANGELOG.md: users receive a plugin change
// only when the version in plugin.json changes.
//
// Usage: node scripts/check-plugin-version.mjs [base ref, default origin/main]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN_DIR = 'plugins/koobiq';
const MANIFEST = `${PLUGIN_DIR}/.claude-plugin/plugin.json`;
const CHANGELOG = `${PLUGIN_DIR}/CHANGELOG.md`;
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;

// Files whose changes don't reach users: no release needed.
const UNRELEASED = [
  /^plugins\/koobiq\/scripts\/tests\//,
  /^plugins\/koobiq\/evals\//,
  /^plugins\/koobiq\/README\.md$/,
  /^plugins\/koobiq\/CHANGELOG\.md$/,
];

export function compareVersions(a, b) {
  const left = SEMVER_RE.exec(a).slice(1).map(Number);
  const right = SEMVER_RE.exec(b).slice(1).map(Number);

  for (let i = 0; i < 3; i += 1) {
    if (left[i] !== right[i]) return left[i] > right[i] ? 1 : -1;
  }

  return 0;
}

/**
 * `changedFiles` are repository paths changed against the base;
 * `baseVersion` is null when the base has no plugin.json yet.
 */
export function checkPluginVersion({
  changedFiles,
  baseVersion,
  headVersion,
  changelog,
}) {
  const released = changedFiles.filter(
    (file) =>
      file.startsWith(`${PLUGIN_DIR}/`) &&
      !UNRELEASED.some((re) => re.test(file))
  );

  const problems = [];

  if (released.length === 0) return { released, problems };

  if (!SEMVER_RE.test(headVersion || '')) {
    problems.push(`${MANIFEST} needs a "version" in the x.y.z form.`);

    return { released, problems };
  }

  if (
    baseVersion &&
    SEMVER_RE.test(baseVersion) &&
    compareVersions(headVersion, baseVersion) <= 0
  ) {
    const files = released.slice(0, 5).join(', ');

    problems.push(
      `The plugin changed (${files}${released.length > 5 ? ', …' : ''}), so "version" in ${MANIFEST} must be greater than ${baseVersion}.`
    );
  }

  const heading = new RegExp(
    `^## ${headVersion.replace(/\./g, '\\.')}(?:\\s|$)`,
    'm'
  );

  if (!heading.test(changelog || ''))
    problems.push(`${CHANGELOG} has no "## ${headVersion}" section.`);

  return { released, problems };
}

const git = (args) =>
  execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

const versionAt = (ref) => {
  try {
    return JSON.parse(git(['show', `${ref}:${MANIFEST}`])).version || null;
  } catch {
    return null;
  }
};

function main() {
  const base = process.argv[2] || 'origin/main';
  let from = base;

  // Locally, compare with the merge-base. A shallow CI checkout of a pull
  // request merge commit has none, and its diff against the base tip is
  // exactly the pull request.
  try {
    from = git(['merge-base', base, 'HEAD']).trim() || base;
  } catch {
    from = base;
  }

  const changedFiles = git(['diff', '--name-only', from, '--', PLUGIN_DIR])
    .split('\n')
    .filter(Boolean);

  const read = (file) => {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch {
      return null;
    }
  };

  const headVersion = JSON.parse(read(MANIFEST) || '{}').version || null;

  const { released, problems } = checkPluginVersion({
    changedFiles,
    baseVersion: versionAt(from),
    headVersion,
    changelog: read(CHANGELOG),
  });

  if (problems.length) {
    process.stderr.write(`${problems.join('\n')}\n`);
    process.exitCode = 1;

    return;
  }

  process.stdout.write(
    released.length
      ? `Plugin ${headVersion}: version and changelog are in place.\n`
      : 'No released plugin files changed.\n'
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
