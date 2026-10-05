# Props

Verify every prop you report or suggest in the installed d.ts:
`node_modules/@koobiq/react-components/dist/components/<Name>/types.d.ts`
or `<Name>.d.ts`. Props composed with `ExtendableProps<Own, Primitive>`
continue in `@koobiq/react-primitives` d.ts (React Aria props). Strict
TypeScript already rejects unknown props and invalid literal unions in
type-checked files — don't repeat what `tsc` reports.

## Conventions consumers rely on

- Boolean props start with `is`: `isDisabled`, `isReadOnly`, `isRequired`,
  `isInvalid`, `isLoading`, `isSelected`, `isOpen`, `isLabelHidden`. Inverted
  defaults use `hide*` / `disable*`; layout flags (`fullWidth`, `onlyIcon`)
  have no prefix; React Aria names (`allowsX`, `shouldX`) stay as is.
- Field `onChange` receives the **value** (`string` for `Input`/`Textarea`,
  `boolean` for `Checkbox`/`Toggle`, a number for `InputNumber`), not a DOM
  event. Selection uses `onSelectionChange(key | keys)`.
- Press handlers: `onPress(e: PressEvent)` (mouse, touch and keyboard);
  `onClick` is not recommended.
- Controlled / uncontrolled triplets: `value` / `defaultValue` / `onChange`,
  `isSelected` / `defaultSelected` / `onChange`, `isOpen` / `defaultOpen` /
  `onOpenChange`, `selectedKey(s)` / `defaultSelectedKey(s)` /
  `onSelectionChange`, `inputValue` / `defaultInputValue` / `onInputChange`,
  `expandedKeys` / `defaultExpandedKeys` / `onExpandedChange`.
- Fixed value sets are exported arrays: `buttonPropVariant` (type
  `ButtonPropVariant`), `typographyPropVariant`, `inputPropVariant`…
- Inner parts are customized through `slotProps={{ <slot>: props }}` with the
  slot keys declared in d.ts (`label`, `input`, `caption`, `popover`…).
- Polymorphic components take `as`: `Button as="a" href`, `Typography as="h1"`.
- Responsive props take one value or an object keyed by Provider
  breakpoints `xs`, `s`, `m`, `l`, `xl`, `xxl`: `gap={{ xs: 's', l: 'xl' }}`.
- Components accept `data-testid` and `className`; state is exposed as
  `data-*` attributes.

## Rules

**deprecated/prop** — no deprecated props · warning · both. The catalog
comes from the runtime `deprecate()` messages (`'<Comp>: the "<a>" prop is
deprecated. Use "<b>" prop to replace it.'`), because the d.ts loses
`@deprecated` on forwardRef components. When the JSDoc and the runtime
message disagree, the runtime message is right (JSDoc says `isVisitable` /
`isReadonly`; the props are `allowVisited` / `isReadOnly`). Semantics can
change with the name: `Modal open` → `isOpen` + `onOpenChange`;
`ProgressBar variant` → `isIndeterminate`; `Badge label` → `children`.

**props/invalid-value** — literal values come from the exported `*Prop*`
arrays · warning · script · list the allowed values.

**props/value-and-default** — never both the controlled and the default
prop · warning · script.

**props/controlled-without-handler** — a controlled prop has its change
handler, or the field is `isReadOnly` / `isDisabled` · warning · script ·
FP: a deliberately blocking modal (both dismiss props disabled).

**props/onchange-event** — `onChange={(e) => set(e.target.value)}` on a Koobiq
field is a bug (`e` is the value) · error · agent · fix: `onChange={set}`.

**props/onclick** — `onPress` instead of `onClick` on `Button`,
`IconButton`, `Link`, `SplitButton` · info · script · FP: handlers that need
the DOM event (`preventDefault` for routing — use `Provider router`).

**props/unknown-prop** — in JS or unchecked files, every prop exists on the
component (own or inherited) · error · agent · FP: `data-*`, `aria-*`,
DOM attributes forwarded by the component, spreads.

**props/responsive-keys** — responsive objects use Provider breakpoint keys ·
error · agent · FP: custom `Provider breakpoints`.

**props/link-as-button-href** — `Link as="button"` ignores `href`; use
`Link` (anchor) or `Button as="a" href` · error · agent.

**props/target-blank-rel** — `target="_blank"` with `rel="noopener noreferrer"`
· warning · agent.

**props/collection-item-id** — collection items (SelectNext, Table, List,
Tree, TagGroup…) have stable `id`s; the deprecated `Select` used `key` ·
warning · agent.

**props/render-dependencies** — render functions of collections that read
outer state pass it in `dependencies` · warning · agent.

**props/slotprops** — inner elements are customized via `slotProps`, not by
targeting internal DOM · warning · agent.

**props/style-instead-of-prop** — `style={{ width: '100%' }}` instead of
`fullWidth`, inline color/align/ellipsis instead of Typography props ·
info · agent.

## Forms

- Every field has a visible `label`, or `aria-label` / `aria-labelledby`
  when the label is hidden (`a11y/field-label`). A placeholder is not a label.
- **props/form-field-name** — fields of uncontrolled forms read through
  `FormData` have a `name` · warning · agent.
- **props/form-validation** — `<Form>` validation behavior decides whether
  invalid fields block submission (check the installed `FormProps`
  `@default`; current versions default to `native`). `isInvalid` alone does
  not block submission. Server errors go through
  `<Form validationErrors={{ field: 'message' }}>`. React Hook Form: wrap the
  field in `Controller`, pass `name`/`value`/`onChange`/`onBlur`, set
  `validationBehavior="aria"`, `isInvalid={invalid}`,
  `errorMessage={error?.message}` and `slotProps={{ input: { ref } }}` ·
  warning · agent.
- **props/error-without-invalid** — `errorMessage` text shows only when the
  field is invalid (`isInvalid` or a failed validation) · warning · agent ·
  FP: a function `errorMessage` with native validation.
