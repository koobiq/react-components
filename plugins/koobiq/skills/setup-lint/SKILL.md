---
name: setup-lint
description: Install the Koobiq ESLint and Stylelint preset into the product — deprecated props and exports, non-public imports, other UI kits and icon sets, unknown and deprecated --kbq-* tokens, hashed classes, literal colors with exact token matches, missing labels, controlled-prop mistakes — so CI enforces the design system without Claude.
argument-hint: '[--dry-run] [--eslint-only|--stylelint-only] [--force]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/setup-lint.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/setup-lint.mjs *) Bash(git rev-parse *)
---

# Koobiq lint preset

Arguments: `$ARGUMENTS`

The preset lives in `${CLAUDE_PLUGIN_ROOT}/lint/`: `koobiq-core.mjs`
(shared knowledge and decisions, the same as `/koobiq:review` uses),
`eslint.koobiq.mjs` and `stylelint.koobiq.mjs`. They are copied into the
product's `.koobiq/` folder with a version header and committed with the
project; rules read the installed `@koobiq/*` packages at lint time.

1. **Root.** The git top-level. In a monorepo, run the steps for each
   folder that has its own lint config (ask which ones).
2. **Plan.**

   ```text
   node "${CLAUDE_PLUGIN_ROOT}/scripts/setup-lint.mjs" --root <root> [--eslint-only|--stylelint-only] [--force]
   ```

   The JSON lists: detected tooling (package manager, ESLint flat / legacy /
   none, Stylelint version, style languages, Prettier), `files` to create or
   update in `.koobiq/` (`unchanged`, `update`, `modified` = edited locally),
   new config files when none exist, `edits` to existing configs with
   snippets, `devDependencies` with the `install` command, and `notes`.

3. **Show the plan** in a short list. `--dry-run` stops here.
4. **Confirm**, then:
   - run the script again with `--apply` (copies `.koobiq/*`, creates
     missing config files, `.koobiq/check.json`, the `.prettierignore` line);
   - apply each entry of `edits` to the existing config with Edit (keep the
     user's config intact; add the import and spread `...koobiq` last);
   - run the `install` command only after a separate confirmation.
5. **Legacy `.eslintrc`.** Don't convert it silently: explain the notes
   (`npx @eslint/migrate-config …`) and stop for ESLint.
6. **Try it.** Run the project's linters on a few UI files (or
   `npx eslint src` / `npx stylelint "src/**/*.css"`) and summarize the
   findings by rule. Don't auto-fix the whole repository without asking.
7. **Tell the user** to commit `.koobiq/` and the config changes, and that
   re-running `/koobiq:setup-lint` updates the preset (local edits are
   detected and kept unless `--force`).

Rule severities and allowances (`uiKits.allow`, `icons.allow`, per-rule
`off`) are tuned in the product's lint config and `.koobiq/check.json`.
