# Public API, deprecations and upgrades

## Public surface

- Entry points of `@koobiq/react-components`: `.` (components, hooks such as
  `useBreakpoints`, `useListData`, `useAsyncList`, `useRouter`, `useLocale`,
  `useFilter`, `useDateFormatter`, `RouterProvider`, layout helpers `flex()`
  and `spacing()`, shared types), `./markdown` (`Markdown`), `./code-block`
  (`CodeBlock`) and `./style.css`. Anything under `dist/` is private.
- `@koobiq/react-icons` (named icon components) and `@koobiq/design-tokens`
  (CSS files under `web/new/`).
- `@koobiq/react-core` and `@koobiq/react-primitives` are internal layers;
  only their documented exports are public: the hooks `useBoolean`,
  `useCopyToClipboard`, `useDebounceCallback`, `useElementOverflow`,
  `useElementSize`, `useEventListener`, `useHideOverflowItems`, `useInterval`,
  `useMediaQuery`, `useRefs`, `useResizeObserver`, the `FileSizeFormatter`
  utility, and the `Button` / `Link` primitives.
- Styling contract: props, `className`, `slotProps`, `data-*` attributes and
  `--kbq-<component>-*` override variables. Hashed class names, private
  `--<component>-*` variables and internal DOM are not public.

## Rules

**import/deep** — imports only from public entry points · error · script.

**import/unknown-export** — the imported name exists in that entry (e.g.
`Markdown` comes from `/markdown`, not the main entry) · error · script.

**import/internal-layer** — undocumented exports of react-core /
react-primitives / logger; when the DS re-exports the name, import it from
`@koobiq/react-components` · warning · script.

**import/direct-core-dependency** — an app declares an internal package it
never imports · warning · script.

**import/react-aria-direct** — React Aria imported next to the DS; prefer the
Koobiq component, and keep React Aria versions aligned with the ones
`@koobiq/react-primitives` pins (two copies break shared contexts) · info ·
script.

**deprecated/component**, **deprecated/export** — deprecated exports
(`Select` → `SelectNext`, `Navbar` → `TopNavbar` / `SideNavbar`,
`ModalHeader` / `ModalContent` / `ModalFooter` → `Modal.Header` / `Body` /
`Footer`, same for `SidePanel*` and `Popover*`, `TypographyDisplayVariant`,
`containerPositionProp`…) · warning · both · the JSDoc names the replacement.

## Lifecycle

The package is 0.x. Components carry a status in the docs (`<Status
variant>` on each page, also in `llms/components-<name>.txt`):

- **stable** — follows semver; breaking changes go through deprecation.
- **experimental** — the API may change in a minor release.
- **deprecated** — still works, logs a warning in development, gets no new
  features, and is removed in the next major release. Replacements use the
  `Next` suffix (`SelectNext`) and coexist with the old component.

## Upgrading `@koobiq/react-components`

1. Read `CHANGELOG.md` between the versions (tags are plain versions, e.g.
   `0.37.0`): `https://raw.githubusercontent.com/koobiq/react-components/<tag>/CHANGELOG.md`.
   Only `feat` and `fix` entries are listed; `!` marks breaking changes.
2. For components the app imports, diff the public API reports between the
   tags: `tools/public_api_guard/components/<Name>.api.md` (available from
   0.34.0). Removed exports, removed props, props that became required,
   narrowed unions and changed generics are breaking. The reports omit
   members of non-exported helper types and CSS (override variables,
   `data-*`), so read the changelog too.
3. Bump the DS together with its peers (`@koobiq/design-tokens`,
   `@koobiq/react-icons`) within the ranges in the new `peerDependencies`.
4. Run the app's type-check, then `koobiq-check`: TypeScript reports removed
   or renamed props; the checker reports new deprecations, tokens that no
   longer exist and setup changes.
5. Retest behavior fixes listed in the changelog for the components in use.
