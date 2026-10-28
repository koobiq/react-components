<!-- koobiq:begin v1 — managed by /koobiq:init; edit only the exceptions list -->

## Koobiq design system (@koobiq/react-components)

Docs for agents: https://react.koobiq.io/llms.txt (per component:
`https://react.koobiq.io/llms/components-<name>.txt`). The version installed
in `node_modules` wins over the docs.

- Use Koobiq components instead of raw `<button>`, `<input>`, `<select>`,
  `<textarea>`, `<a>`, `<table>` or other UI kits; compose compound slots
  (`Modal.Header`, `Modal.Body`, `Modal.Footer`).
- Check props in `node_modules/@koobiq/react-components/dist/components/<Name>/`.
  Never use deprecated props (`disabled` → `isDisabled`, `checked` →
  `isSelected`, `open` → `isOpen`). Booleans are `is*`; handlers are
  `onPress` and `onChange(value)`.
- Style with theme-aware `--kbq-*` tokens from `@koobiq/design-tokens/web/new`.
  Customize through props, `slotProps`, `data-*` attributes or documented
  `--kbq-<component>-*` variables; never target hashed `kbq-*` classes.
- Setup: import `web/new/css-tokens.css`, `-light.css` and `-dark.css` before
  `@koobiq/react-components/style.css`; put `kbq-light` / `kbq-dark` on
  `<html>` or `<body>`; wrap the app in `<Provider locale router>`; render
  `<ToastProvider />` before calling `toast`.
- Accessibility: every field has `label` or `aria-label`; icon-only buttons
  have `aria-label`.
- Dates: date components take `@internationalized/date` values; format them
  with `@koobiq/date-formatter`.
- Public API only: `@koobiq/react-components` (plus `/markdown`,
  `/code-block`, `/style.css`), `@koobiq/react-icons`, `@koobiq/design-tokens`;
  from `@koobiq/react-core` only its documented hooks.
- Check your work with the project linters (the Koobiq preset lives in
  `.koobiq/` when installed) or `/koobiq:review` in Claude Code.

### Project exceptions

<!-- koobiq:exceptions:begin -->
<!-- koobiq:exceptions:end -->

<!-- koobiq:end -->
