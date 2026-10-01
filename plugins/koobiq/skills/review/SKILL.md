---
name: review
description: Review product UI code that uses @koobiq/react-components against the Koobiq design system — Koobiq components vs raw HTML or other UI kits, compound slots, props and deprecations, TypeScript, tokens and theming, a11y, i18n, public API. Runs the koobiq-check script, then verifies and extends its findings with koobiq:reviewer agents.
when_to_use: The user asks to review, check or audit UI changes, a page, a component or the whole app for Koobiq / design-system conformance ("check my changes against Koobiq", "проверь на соответствие дизайн-системе", "audit our Koobiq usage"). Not for generic code review or bug hunting.
argument-hint: '[paths|ComponentName …] [--base <ref>] [--all] [--fix] [--deep] [--offline]'
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-review-prep.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-review-prep.mjs *) Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs *) Bash(git diff *) Bash(git merge-base *) Bash(git rev-parse *) Bash(git ls-files *) Bash(git status *) WebFetch(domain:react.koobiq.io)
---

# Koobiq design-system review

Arguments: `$ARGUMENTS`

You orchestrate; `koobiq:reviewer` agents do the file-level judgment; the
deterministic checker supplies candidates. Do not review the files yourself
before the agents report — your job is scope, delegation, verification and
the report.

## 0. Parse the arguments

- Paths or globs → `--paths a,b`. PascalCase words that are Koobiq exports
  (`Modal`, `SelectNext`) → `--components Modal,SelectNext`.
- `--base <ref>`, `--all` (audit), `--fix`, `--deep` (second verification
  wave), `--offline` (no WebFetch).
- No scope arguments → the branch diff against the merge-base plus
  uncommitted and untracked files.
- `LANGUAGE`: the language the user writes in.

If the root `package.json` is named `koobiq-react`, this is the design
system repository: only `templates/**` is product code — say so and narrow
the scope, or stop.

## 1. Prepare (one deterministic call)

```text
node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-review-prep.mjs" --root "<git top-level or cwd>" [--base <ref> | --all | --paths <a,b> | --components <A,B>]
```

It prints a manifest: `runDir`, DS and token versions, the token set,
checker counts, `skipped` / `errors`, and `batches` (each with its JSON
file, files, lines and candidate count; `batch-00-setup` holds project-level
setup findings).

- `emptyScope: true` → say there is nothing to review and suggest paths or
  `--all`. Stop.
- `ds.version` is null → the DS is not installed: tell the user to install
  dependencies; continue only with what does not need the installed package.
- The script fails → show its stderr and stop.

## 2. Cost gate

More than 5 batches, or `--all` over 60 files → ask with AskUserQuestion:
narrow the scope (suggest folders), or run **audit mode** (agents verify
the script candidates only, plus an open review of the 10 files with the
most candidates).

## 3. Delegate

Send one Agent call per batch, all in a single message (at most 5 per wave),
with `subagent_type: "koobiq:reviewer"` and the prompt from
`delegation-prompt.md` (absolute paths only). The setup batch always runs
when it exists.

## 4. Merge

Parse each agent's ```json block. Dedupe by `id + file + line`. Keep only
findings inside the changed ranges of their batch (or `hunks: "all"`).
Collect `dismissed` and `suppressed` for the counts. Agents that return
`partial: true` → mention which files were not fully covered.

## 5. Verify

- Default: for every **error**, open each `evidence` citation yourself.
  Confirm it, downgrade to warning with `confidence: "unverified"`, or drop
  it.
- `--deep`: run a second wave with `MODE=verify` over all errors and
  warnings, each batch going to a different agent than the first time.

## 6. Present (`report-format.md`)

If a `ReportFindings` tool is available (load it with
`ToolSearch select:ReportFindings` if it is deferred), report the findings
with it, most severe first. Otherwise write the markdown report. Either way
end with the English tally line
`Koobiq review: <E> errors | <W> warnings | <I> info` and next steps
(`--fix`, `/koobiq:upgrade` for deprecations, `/koobiq:setup-lint` to keep
the rules in CI).

## 7. `--fix` (`fix-playbook.md`)

Load `koobiq:guidelines`. Apply **safe** fixes directly; group **assisted**
fixes and ask before applying; never apply **manual** ones. Never touch
`package.json` or lockfiles (that is `/koobiq:upgrade`). Afterwards re-run
the checker on the touched files and the project's type-check script if it
has one; report what remains. Do not commit.
