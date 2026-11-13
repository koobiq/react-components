# Contributing

Thank you for helping improve Koobiq React. This guide explains how to report a problem, set up the repository and get a pull request merged.

Contributions are accepted under the [MIT License](https://github.com/koobiq/react-components/blob/main/LICENSE).

## Questions, bugs and ideas

- Ask a question, report a bug or propose an improvement with an [issue form](https://github.com/koobiq/react-components/issues/new/choose). Search the existing issues first and add the package version.
- Send a small change straight as a pull request: a bug fix, a visual or accessibility defect, or a correction in the docs.
- Discuss a large change in an issue before writing code: a new component, a new public API or a breaking change.
- Report a security vulnerability privately with **Report a vulnerability** on the [Security tab](https://github.com/koobiq/react-components/security), never in a public issue or pull request.

## Setup

- Use the Node.js version from [`.nvmrc`](https://github.com/koobiq/react-components/blob/main/.nvmrc) and the pnpm version from `packageManager` in [`package.json`](https://github.com/koobiq/react-components/blob/main/package.json): `corepack enable` picks it up.
- Install the dependencies with `pnpm install`. It also installs the git hooks: before each commit they fix lint and formatting in the staged files, run the unit tests related to them and type-check the workspace, then check the commit message.
- Start Storybook with `pnpm dev` at [http://localhost:6006](http://localhost:6006). All development happens there.

The packages, the anatomy of a component, the styling rules and the full list of commands are described in [AGENTS.md](https://github.com/koobiq/react-components/blob/main/AGENTS.md).

## Making a change

1. Fork the repository, or push a branch to it if you have write access. Branch from `main`: it is the only release line.
2. Make the change with its stories, docs page and tests, following [AGENTS.md](https://github.com/koobiq/react-components/blob/main/AGENTS.md). Deprecate components and props as the [Deprecation Strategy](https://react.koobiq.io/?path=/docs/deprecation-strategy--docs) describes.
3. Run the checks CI runs:

   ```bash
   pnpm type-check
   pnpm format:check
   pnpm lint:css --max-warnings=0
   pnpm lint:js --max-warnings=0
   pnpm vitest run                                    # Unit tests; `pnpm vitest run Button.test.tsx` for one file
   pnpm build && pnpm check-api                       # Public API reports
   KOOBIQ_DS_DIR=packages/components pnpm test:plugin # Claude Code plugin, after `pnpm build`
   pnpm build-storybook                               # Documentation build, as the preview deploy runs it
   pnpm e2e:docker                                    # Screenshot tests; `-g <title>` filters them by test title
   ```

4. Open a pull request against `main`.

What the checks expect:

- **Unit tests** fail on any unexpected `console.warn` or `console.error` ([`tools/vitest/setupTests.ts`](https://github.com/koobiq/react-components/blob/main/tools/vitest/setupTests.ts)). Fix the cause, such as an `act(...)` or accessibility warning. When a message is expected, mock the console method in that test, assert every argument and restore the mock. Output the repository does not own goes to the `silenceMessage` allowlist in the same file.
- **The public API** of every component and package is pinned in `tools/public_api_guard/`. After an intentional change, run `pnpm build && pnpm approve-api <Name>` with a component name or `react-primitives`, `react-core`, `logger`, and commit the reports. A new component is also added to `tools/api-extractor/config.json`.
- **Screenshot baselines** belong to the linux/arm64 Docker image in `tools/e2e` and have no platform suffix, so a native run fails on font rendering. Update them with `pnpm e2e:docker:update-snapshots`. On a branch of this repository, a maintainer can comment `/approve-snapshots` on the pull request instead, and CI commits the new baselines. While writing a test, `pnpm e2e:components --ui` runs the suite natively (install the browser once with `pnpm e2e:setup`), but its screenshots are not comparable.
- **The Claude Code plugin** in `plugins/koobiq/` reads the built package. Keep the `deprecate()` message format, the generated class names, the `<component>Prop<Name>` value arrays and the entry points stable, or update the plugin in the same pull request. A change to the plugin itself bumps `version` in `plugins/koobiq/.claude-plugin/plugin.json` and adds a section to `plugins/koobiq/CHANGELOG.md`; CI checks both. See the plugin's [maintainer notes](https://github.com/koobiq/react-components/blob/main/plugins/koobiq/README.md).
- **New dependencies**: pnpm installs only versions published at least a day ago (`minimumReleaseAge` in `pnpm-workspace.yaml`).

## Commit messages and pull request titles

commitlint checks the commit message in the `commit-msg` hook and the pull request title in CI. The rules come from [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).

```
<type>(<scope>): <subject>
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` or `revert`.
- **scope** (optional): the component name (`Button`, `SelectNext`). Separate several with a comma and a space: `fix(Popover, Modal): …`. Use `components` for a new component or a change across many; otherwise name the area: `core`, `primitives`, `plugin`, `storybook`, `ci`, or `deps` for dependencies.
- **subject**: in the imperative mood, starting with a lowercase letter, with no period at the end.
- The header and every line of the body and footer are at most 100 characters.
- Put the task reference at the end of the subject: `(DS-1234)`, without `#`. Link a GitHub issue in the pull request description with `Closes #123`.
- Mark a breaking change with `!` after the scope, and describe the migration in a `BREAKING CHANGE:` footer of the commit message. Not in the `plugin` scope: the note would reach the library's changelog.

Examples:

```
feat(components): add TopNavbar and SideNavbar components (DS-5259)
fix(Popover, Modal, SidePanel): unify the overlay z-index layer (DS-5504)
fix(SelectNext, TreeSelect)!: keep disabled items on clear (DS-5487)
```

- Pull requests are squash-merged. The commit in `main` takes the pull request title, or the commit message when the pull request has a single commit, so keep both in this format.
- The title check runs when the pull request is opened, reopened or pushed to. After fixing the title, push a commit or close and reopen the pull request: re-running the old check reads the old title.
- `CHANGELOG.md` is generated from `main` at release time. Only `feat` and `fix` appear in it, except the `plugin` scope, and `!` lists the change under Breaking Changes. Do not edit the changelog or the package versions.

## Pull requests

- Keep one change per pull request: it becomes one commit in `main`.
- Describe what changes and why, and add screenshots for a visual change.
- Open unfinished work as a [draft](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests) and mark it **Ready for review** when it is done. Reviewers are requested automatically from [CODEOWNERS](https://github.com/koobiq/react-components/blob/main/.github/CODEOWNERS).
- Keep the branch up to date with `main`: a pull request with conflicts gets no CI runs at all.
- CI on a first pull request from a fork may wait until a maintainer approves the workflow runs.
- A pull request from a branch of this repository gets a Storybook preview: a bot comments the link, which expires 5 days after the last push. Pull requests from forks get no preview.

## Ready to merge

A maintainer squash-merges the pull request when:

- CI is green, including the commitlint check of the title;
- a code owner has approved it and the review threads are resolved;
- it has no conflicts with `main`.

A branch of this repository is deleted automatically after the merge; a branch in a fork is not.
