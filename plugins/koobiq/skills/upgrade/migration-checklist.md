# Migration checklist template

Write the checklist in the user's language; keep ids, code and versions as
they are. Omit empty sections.

```markdown
## Koobiq upgrade 0.36.0 → 0.37.0

Components in use: Button, Link, Modal, SelectNext (14 files).

### Must change before or with the bump

- [ ] **Link** — `as="button"` now renders button semantics; `href` is ignored
      there (changelog 0.37.0, fix). Usages: `src/nav/Menu.tsx:41`.
- [ ] **Removed export** `XxxProps.foo` (api report) — usages: …

### Deprecations to clear (they log warnings and go away in the next major)

- [ ] `Button disabled` → `isDisabled` — `src/pages/Users.tsx:57, 61` (safe fix)
- [ ] `ModalHeader` → `Modal.Header` — `src/dialogs/Confirm.tsx:12` (safe fix)

### Dependencies

- [ ] `@koobiq/react-components` 0.36.0 → 0.37.0
- [ ] new optional peer `highlight.js ^11.0.0` — only if you import
      `@koobiq/react-components/code-block`

### Risks

- Experimental components in use: `TimeRange` (may change in minor releases).
- Behavior fixes to retest: Tabs in Safari (0.37.0).

### After the bump

1. `npm run type-check` (or `tsc --noEmit`)
2. linters, then `koobiq-check` again
3. smoke-test the screens listed above in light and dark themes
```
