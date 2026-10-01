# Severity and output

## Severity

- **error** — broken behavior, an accessibility blocker, an API that does not
  exist (removed, misspelled, private path), UI invisible or unreadable in one
  of the themes.
- **warning** — deprecated API, values that bypass tokens, a re-implemented
  Koobiq component, hashed-class targeting, missing labels.
- **info** — consistency and polish.

Adjustments:

- Tests, stories and fixtures drop one level and are never errors.
- In JavaScript or files excluded from type-checking, prop errors stay errors
  (nothing else catches them).
- A finding you could not verify (`confidence: unverified`) is at most a
  warning.
- Generated code is skipped.

Confidence: report `high` and `medium` only. `high` means you cited the
evidence (file:line in the product and in the installed d.ts / token CSS);
`medium` means the pattern is clear but intent is uncertain.

## Agent JSON (one ```json block)

```json
{
  "batch": "batch-02",
  "partial": false,
  "findings": [
    {
      "id": "deprecated/prop",
      "severity": "warning",
      "file": "src/pages/Users.tsx",
      "line": 42,
      "endLine": 42,
      "title": "Button: \"disabled\" is deprecated",
      "why": "The DS logs a deprecation warning and removes the prop in the next major.",
      "fix": { "kind": "safe", "snippet": "<Button isDisabled={!dirty}>" },
      "docs": "https://react.koobiq.io/?path=/docs/components-button--docs",
      "evidence": [
        "src/pages/Users.tsx:42",
        "node_modules/@koobiq/react-components/dist/components/Button/Button.js:35"
      ],
      "source": "script",
      "scriptRef": "3f2a9c1d0b7e4a51",
      "confidence": "high"
    }
  ],
  "dismissed": [{ "scriptRef": "…", "reason": "intentional: decorative SVG" }],
  "suppressed": []
}
```

`fix.kind`: `safe` (mechanical, behavior-preserving), `assisted` (needs a
choice, e.g. which token), `manual` (needs design or product input).
`scriptRef` is the checker fingerprint when the finding started as a script
candidate.

## Report

- Header: DS version, tokens version and set, scope, TypeScript tier.
- "Project setup" block for project-level `setup/*` findings.
- Findings grouped by severity, then by file; same id in one file is one
  finding listing up to five lines. Over 50 findings, warnings and info are
  grouped by id.
- Counts of dismissed and suppressed findings.
- Last line, always in English:
  `Koobiq review: <E> errors | <W> warnings | <I> info`.

## Docs links

`https://react.koobiq.io/?path=/docs/<id>` with ids
`components-<lowercase name>--docs` (SideNavbar / TopNavbar:
`components-navbar-sidenavbar--docs`, `components-navbar-topnavbar--docs`),
`welcome--docs`, `forms--docs`, `responsive-ui--docs`, `fonts--docs`,
`icons--docs`, `component-lifecycle--docs`, `deprecation-strategy--docs`,
`utilities-dateformatter--docs`, `ai-claude-code-plugin--docs`. Agent-readable
versions: `https://react.koobiq.io/llms.txt` and
`https://react.koobiq.io/llms/components-<lowercase name>.txt`.
