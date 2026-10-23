---
name: init
description: Add Koobiq design-system guidance to the product's AGENTS.md or CLAUDE.md (a managed block any coding agent reads), check the Koobiq setup, and optionally register the Koobiq plugin marketplace for the whole team.
argument-hint: '[--target AGENTS.md|CLAUDE.md] [--share]'
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/init-agents.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/init-agents.mjs *) Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs *) Bash(git rev-parse *)
---

# Koobiq init

Arguments: `$ARGUMENTS`

The block lives in `${CLAUDE_SKILL_DIR}/agents-block.md`; the helper keeps
it idempotent and preserves the project's exceptions list.

1. **Root.** Use the git top-level (`git rev-parse --show-toplevel`). In a
   monorepo with several apps, ask whether the block goes at the repository
   root (shared rules) or into one app.
2. **Plan.**

   ```text
   node "${CLAUDE_PLUGIN_ROOT}/scripts/init-agents.mjs" --root <root> [--target <file>] [--share]
   ```

   It prints JSON: the chosen `target`, `action` (`create`, `append`,
   `update`, `unchanged`, `conflict`), a `diff`, and `notes`. It picks
   AGENTS.md when it exists or when there is no CLAUDE.md: Claude Code reads
   AGENTS.md only when no CLAUDE.md / CLAUDE.local.md is on the path, so with
   both files the CLAUDE.md needs an `@AGENTS.md` import (the notes say so).

3. **Confirm.** Show the diff and the notes, then ask before writing.
   `unchanged` → nothing to do. `conflict` → the file has missing or
   duplicate `koobiq:begin` / `koobiq:end` markers: show where and ask the
   user to fix them; don't write.
4. **Write.** Re-run with `--apply`. If a note recommends the `@AGENTS.md`
   import, offer to add it as the first line of CLAUDE.md (separate
   confirmation).
5. **Setup check.**

   ```text
   node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs" --root <root> --only setup --format text
   ```

   Present the setup findings; offer fixes only when the user asks.

6. **`--share`.** The plan includes `.claude/settings.json` with the Koobiq
   marketplace and `koobiq@koobiq-react` enabled. Teammates get the plugin
   after they trust the folder. Existing settings are kept; confirm before
   writing.

Exceptions: users add lines inside the exceptions sub-block, e.g.
`- allow component/raw-element in src/legacy/** — legacy pages` or
`- allow @mui/x-data-grid — no Koobiq data grid`. `/koobiq:review` and the
reviewer agent honor them.
