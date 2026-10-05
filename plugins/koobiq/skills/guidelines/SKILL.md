---
name: guidelines
description: Koobiq design-system rules for writing or changing UI in apps built with @koobiq/react-components — Koobiq components instead of raw HTML or other UI kits, compound slots, is*/onPress/onChange(value) props, theme-aware --kbq-* tokens, accessible labels, Provider locale and @koobiq/date-formatter, public API only.
when_to_use: Before creating or editing React components, pages, forms or CSS in a project whose package.json depends on @koobiq/react-components, and when reviewing such code. Not for work inside the koobiq/react-components repository itself.
user-invocable: false
---

# Koobiq design system in product code

## Scope

These are rules for **products that consume** `@koobiq/react-components`. If
the root `package.json` is named `koobiq-react`, you are inside the design
system repository: follow its AGENTS.md instead (only `templates/**` are
product code there).

## Paths

- Checker: `node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs"` — add
  `--files <a,b>` for specific files, `--changed` for the branch diff,
  `--format text` for a readable summary.
- References: `${CLAUDE_SKILL_DIR}/references/` (index below).

## Before writing UI

1. **Installed version.** Read `version` in
   `node_modules/@koobiq/react-components/package.json`. Rules and APIs below
   apply to the installed version, not to whatever the latest docs say.
2. **Pick the component** from the table in `components-usage.md`. Prefer a
   Koobiq component over raw HTML, another UI kit or a hand-rolled widget.
3. **Read its props** in
   `node_modules/@koobiq/react-components/dist/components/<Name>/`
   (`types.d.ts`, `<Name>.d.ts`). For behavior and examples:
   `https://react.koobiq.io/llms/components-<lowercase name>.txt`.
4. **Avoid deprecated props.** The d.ts can lose `@deprecated`; the runtime
   messages are reliable: grep `prop is deprecated` in
   `dist/components/<Name>/*.js`.

## Golden rules

- Use Koobiq components for controls, overlays, collections, feedback and
  layout (`component/raw-element`, `import/other-ui-kit`).
- Icons come from `@koobiq/react-icons` (`Icon<Name><Size>`)
  (`import/other-icons`).
- Compose compound components from their slots: `Modal.Header`,
  `Modal.Body`, `Modal.Footer` (`component/slot-composition`).
- Overlay `control` render props are spread onto a Koobiq control
  (`component/overlay-control`).
- Booleans are `is*`: `isDisabled`, `isReadOnly`, `isInvalid`, `isLoading`,
  `isOpen` (`deprecated/prop`).
- Field `onChange` receives the value, not an event (`props/onchange-event`).
- Press handlers are `onPress` (`props/onclick`).
- Controlled props come with their handler; never set `value` and
  `defaultValue` together (`props/controlled-without-handler`,
  `props/value-and-default`).
- Variants and other fixed values come from the exported `*Prop*` arrays
  (`props/invalid-value`).
- Customize inner parts with `slotProps`, never with selectors on hashed
  classes (`props/slotprops`, `style/hashed-class`).
- Colors, spacing, radius, typography, shadows and z-index come from
  `--kbq-*` tokens of `@koobiq/design-tokens/web/new`; a token you suggest
  must exist in the installed CSS, in both themes for colors
  (`style/hardcoded-color`, `token/unknown`).
- No deprecated or legacy-only tokens (`token/deprecated`,
  `token/legacy-only`).
- Theme with the `kbq-light` / `kbq-dark` class on `<html>` or `<body>`
  (`setup/theme-class-scope`).
- Text uses `<Typography variant>` or `--kbq-typography-*`
  (`token/raw-typography`).
- Every field has `label`, `aria-label` or `aria-labelledby`; icon-only
  buttons have `aria-label` (`a11y/field-label`, `a11y/icon-button-label`).
- Forms: `name` for uncontrolled fields, errors via `errorMessage` +
  `isInvalid`, React Hook Form through `Controller` (`props/form-validation`).
- Date components take `@internationalized/date` values; displayed dates use
  `@koobiq/date-formatter` (`i18n/date-value-type`,
  `i18n/native-date-format`).
- Localized apps pass the locale to `<Provider locale>`
  (`i18n/provider-without-locale`).
- Import only public entry points: `@koobiq/react-components`, `/markdown`,
  `/code-block`, `/style.css` (`import/deep`, `import/unknown-export`).
- From `@koobiq/react-core` / `@koobiq/react-primitives` only their
  documented hooks, `FileSizeFormatter` and the `Button` / `Link` primitives
  (`import/internal-layer`).
- Type wrappers with the exported Koobiq types (`ButtonProps`, `InputRef`,
  `ButtonPropVariant`) instead of DOM types, unions copied by hand or `any`
  (`typescript/wrapper-props`, `typescript/redeclared-values`).

## Verify before you finish

1. Every prop you used or suggested exists in the installed d.ts (follow
   `ExtendableProps` into `@koobiq/react-primitives` for inherited ones).
2. Every `--kbq-*` name exists in
   `node_modules/@koobiq/design-tokens/web/new/css-tokens*.css` or in the DS
   `dist/style.css`.
3. Every import exists in the entry you import it from.
4. Run the checker on the files you touched and fix what it reports.

## References

Read only what the task needs:

- `setup.md` — packages, token and style imports, Provider, theme class, fonts.
- `components-usage.md` — which Koobiq component replaces what; slots,
  overlays, layout, lifecycle status.
- `props.md` — prop conventions, deprecated props, controlled props, forms.
- `typescript.md` — exported types, wrapper typing, refs, generics.
- `styling.md` — token groups, override variables, hashed classes.
- `a11y.md` — labels and names, headings, landmarks.
- `i18n.md` — locale, date values and formatting, localized strings.
- `public-api-and-upgrades.md` — entry points, deprecations, lifecycle,
  upgrade procedure.
- `severity-and-output.md` — severity model and the review output format.

## After writing

Run the checker on the changed files. For a design-system review of a branch
or a folder, suggest `/koobiq:review`; for library upgrades,
`/koobiq:upgrade`.
