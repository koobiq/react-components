# Fix playbook

Apply fixes with Edit, one file at a time, after the review is presented.
Re-read the surrounding code before each edit.

## Safe — apply directly

- **Deprecated prop renames** with the same meaning, verified in the
  installed catalog: `disabled` → `isDisabled`, `readonly` → `isReadOnly`,
  `required` → `isRequired`, `error` → `isInvalid`, `checked` → `isSelected`,
  `defaultChecked` → `defaultSelected`, `hiddenLabel` → `isLabelHidden`,
  `progress` → `isLoading`, `visitable` → `allowVisited`, `pseudo` →
  `isPseudo`, `compact` → `isCompact`, `colored` → `isColored`, `fixed` →
  `isFixed`, `description` → `caption` (RadioGroup).
- **Deprecated slot exports** → compound slots: `<ModalHeader>` →
  `<Modal.Header>`, `ModalContent` → `Modal.Body`, `ModalFooter` →
  `Modal.Footer` (same for `SidePanel*`, `Popover*`); drop the unused import.
- **Legacy token imports** → `web/new/css-tokens.css`, `-light.css`,
  `-dark.css` — only after the checker shows no `token/legacy-only` in the
  product's CSS.
- `@koobiq/react-components/dist/style.css` → `@koobiq/react-components/style.css`;
  token imports moved above `style.css`.
- Imports of names the DS re-exports: `useLocale` from `@koobiq/react-core` →
  from `@koobiq/react-components`.
- `target="_blank"` → add `rel="noopener noreferrer"`.
- `onClick` → `onPress` on Koobiq pressables when the handler doesn't use
  the event object.
- Token typos with exactly one close match (`token/unknown` suggestion).

## Assisted — group and ask first

- Renames whose meaning changes: `open` → `isOpen` (+ `onOpenChange`),
  `variant` → `isIndeterminate` (ProgressBar/Spinner), `Badge label` →
  children, `position` → `placement`.
- Raw control → Koobiq component (`<button>` → `Button`, `<input>` → `Input`
  with `label`): props, events and styles change.
- Literal color → token: confirm the token's role (background, foreground,
  line) with the user when more than one fits.
- Other UI kit / icon library → Koobiq equivalent.
- Missing labels: propose the text, ask the user to confirm it.
- `Select` → `SelectNext`, `Navbar` → `TopNavbar` / `SideNavbar`.

## Manual — never apply

Re-implemented widgets, composition changes, theme-scope moves, version
upgrades, anything in `package.json` or lockfiles, anything the user marked
as an exception.

## After fixing

```text
node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs" --files <touched files, comma-separated> --format text
```

Then the project's type-check (`npm run type-check`, `tsc --noEmit`, …) if
it has one. Report what was fixed, what remains and why. Do not commit.
