# Report format

## ReportFindings (desktop app)

One entry per finding, most severe first:

- `file`, `line` — from the finding.
- `summary` — `<id>: <title>` (one sentence, user's language).
- `short_summary` — the title, at most 60 characters.
- `failure_scenario` — why it matters, then the fix in one line
  (`→ <Button isDisabled>`).
- `category` — the rule category (`deprecated`, `token`, `a11y`, …).

After the tool call, still write the short text summary below (header,
setup block, counts, tally line), without repeating every finding.

## Markdown

````markdown
**Koobiq review** · DS 0.37.0 · tokens 3.17.2 (web/new) · scope: changes vs origin/main (14 files) · TypeScript parser

### Project setup

- ⚠️ `src/main.tsx:8` — design tokens come from the legacy set → import `@koobiq/design-tokens/web/new/*` ([docs](https://react.koobiq.io/?path=/docs/welcome--docs))

### Errors

- `src/pages/Users.tsx:42` **token/unknown** — `--kbq-foreground-contrast-secondry` does not exist → `var(--kbq-foreground-contrast-secondary)`

### Warnings

- `src/pages/Users.tsx:57, 61` **deprecated/prop** — `Button disabled` is deprecated → `isDisabled`

  ```tsx
  <Button isDisabled={!dirty}>Save</Button>
  ```

### Info

- …

Dismissed 3 checker candidates (intentional), 1 suppressed by `koobiq-ignore`.

Next: `/koobiq:review --fix` applies 4 safe fixes; `/koobiq:upgrade` lists deprecations across the app.

Koobiq review: 1 errors | 2 warnings | 0 info
````

Rules:

- Group by severity, then by file; the same id in one file is one entry
  listing up to five lines. Over 50 findings, group warnings and info by id
  with counts.
- Every entry: location, id, what is wrong, the fix (code when it helps), a
  docs link when one fits.
- Prose in the user's language; ids, code and the tally line in English.
- The tally line is always the last line.
