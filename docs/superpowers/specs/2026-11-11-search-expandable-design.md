# SearchExpandable design

## Intent

Add `SearchExpandable` to `@koobiq/react-components`. It is an icon-only search button while collapsed and a compact search field while expanded. The attached Angular specification was the source of behavioral requirements, but the public API, implementation, styling, localization, and tests must follow this React repository.

This document is the complete, self-contained implementation contract. The builder does not need the original Angular specification; where an Angular rule has no React equivalent or conflicted with the chosen controlled semantics, the adaptation is stated here explicitly.

The component is for consumers that need search or filtering without permanently reserving space for a field. It owns input and disclosure behavior only; consumers own searching, filtering, and result rendering.

## Goals

- Preserve the specified collapsed/expanded rendering, debounce, Enter mode, reset, disabled, focus, tooltip, accessible-name, and locale behavior where it has a React equivalent.
- Support controlled and uncontrolled value and open state.
- Reuse `SearchInput`, `IconButton`, `Tooltip`, FormField validation, and repository hooks.
- Provide unit tests, Storybook documentation, screenshot coverage, localization, and an API Extractor report.
- Keep the expanded input responsive to every keystroke even when the public value is updated only after a debounce.

## Non-goals and anti-goals

- No Angular `FormControl`/`NgModel` requirement, `ErrorStateMatcher`, NgModule, DI locale providers, writable signals, `FocusMonitor`, or Angular effect semantics.
- No Angular host classes or SCSS copied into the React package.
- No separate primitive package or public behavior hook until another consumer exists.
- No second immediate `onChange`/`onSearch` public event. Public `onChange` is the committed, debounced/Enter-driven event from the specification.
- No changes to `SearchInput` runtime behavior for existing consumers.
- No search request, filtering, result list, or server integration.
- A controlled parent must not be bypassed: nonempty `value` must not force `isOpen={false}` open.

## Constraints

- Follow the package layering and import React Aria only through `@koobiq/react-core` and `@koobiq/react-primitives`.
- Start the component with `'use client'`, use `forwardRef`, set `displayName`, document public props, and expose state through `data-*` attributes.
- Use CSS Modules, logical properties, design tokens, and the existing icons/components. Do not copy visual values merely because they exist in Angular.
- Use `useControlledState`, `useDebounceCallback`, `useLocalizedStringFormatter`, and existing focus/ref helpers where they fit. Keep pending callbacks current and cancel timers on reset, replacement, external close, and unmount.
- Preserve React 18/19 compatibility, SSR safety, and Strict Mode-safe effects.
- `axe-core` is not currently a direct dependency or an imported test utility. The explicit no-axe-violations requirement therefore includes adding `axe-core` as a development-only test dependency, subject to approval of this design. It is not a runtime dependency.

## Approaches

### Chosen: compose `SearchInput`

Keep an immediate internal draft and pass it as the controlled value of `SearchInput`. Reuse its search icon and FormField integration. Configure its clear button as the always-visible close button, and compose the input and button handlers so Enter, Escape, and close produce exactly one committed reset/emission.

Advantages: consistent visuals, validation, disabled behavior, native form integration, and accessibility; less duplicated code. Cost: React Aria already handles Escape and clear, so handler ordering and duplicate emissions require focused tests.

### Rejected: build the field directly on FormField

A native input and lower-level FormField pieces would give complete event control, but would duplicate `SearchInput` markup, search-specific behavior, clear-button styling, and ARIA wiring.

### Rejected: add a primitive behavior hook first

A new primitive would add public API and another layer without a second consumer. Extraction can be reconsidered later if the behavior is reused.

## Public API

The component is exported from the main package entry as `SearchExpandable`.

| API                                        | Contract                                                                                                                                                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value?: string \| null`                   | Controlled committed value. `null` displays as an empty field. Prop writes update the draft without an echo and cancel an older pending emission.                                                                                                             |
| `defaultValue?: string`                    | Initial uncontrolled committed value; defaults to `''`.                                                                                                                                                                                                       |
| `onChange?: (value: string) => void`       | Emits after the debounce, immediately in Enter mode, and synchronously on user-initiated collapse. Unchanged values are skipped except the forced collapse reset.                                                                                             |
| `isOpen?: boolean`                         | Controlled open state. It is authoritative over automatic expansion, including on the initial render.                                                                                                                                                         |
| `defaultOpen?: boolean`                    | Initial uncontrolled open state. An initial nonempty value also opens the field, including when `defaultOpen={false}`.                                                                                                                                        |
| `onOpenChange?: (isOpen: boolean) => void` | Reports component-initiated open changes and controlled open requests. External prop writes do not echo through this callback.                                                                                                                                |
| `emitValueTimeout?: number`                | Debounce delay in milliseconds, read for each keystroke; default `200`.                                                                                                                                                                                       |
| `isEmitValueByEnterEnabled?: boolean`      | Disables debounced emission; Enter commits the current draft immediately. Default `false`. The name is retained for cross-platform parity and follows the repository's boolean `is*` convention.                                                              |
| `tooltipText?: string \| null`             | Collapsed-button tooltip and accessible name. `null`/`undefined` use the locale; every other string, including `''`, is preserved.                                                                                                                            |
| `placeholder?: string \| null`             | Input placeholder and accessible name with the same fallback rules.                                                                                                                                                                                           |
| `isDisabled?: boolean`                     | Disables trigger, input, close button, tooltip, `toggle()`, and Escape. The repository `Form` disabled context is honored. It does not itself change open state.                                                                                              |
| `tabIndex?: number \| null`                | Applied to the collapsed button and expanded input. Invalid/non-finite/null values fall back to `0`; disabled state forces `-1`.                                                                                                                              |
| `className`, `style`, `data-testid`        | Applied to the component root.                                                                                                                                                                                                                                |
| Field/form props                           | Relevant `SearchInput` props such as `name`, `form`, required/invalid state, validation, caption, and error message are forwarded. Props that would replace the owned draft, disclosure, addons, keyboard, or clear behavior are omitted.                     |
| `slotProps`                                | Slots for the collapsed `button`, `tooltip`, expanded `input`, and `closeButton`. Owned value/open/disabled/keyboard behavior cannot be replaced; slot labels and test ids remain available. A close-button `aria-label` is the per-instance locale override. |

`SearchExpandableRef` follows the custom-ref pattern used by `CodeBlock`:

```ts
type SearchExpandableRef = {
  element: HTMLDivElement | null;
  toggle: () => void;
};
```

Export prefixed constants to avoid generic names in the package root:

```ts
searchExpandableDefaultValue = '';
searchExpandableDefaultEmitValueTimeout = 200;
```

There is no mandatory surrounding form and no Angular-style locale override object. Native form participation uses the forwarded field props; locale follows the repository `Provider`.

## Rendering and styling

- The root is a `div` with `data-slot="search-expandable"`, the caller's test id, and boolean open/disabled state attributes. Its CSS Module root class is `.base`.
- Collapsed: one `IconButton` with `type="button"`, the magnifying-glass icon, localized `aria-label`, and a `Tooltip`. No search field is rendered.
- Expanded: one `SearchInput` with the magnifying-glass start addon, `type="text"`, `autoComplete="off"`, and its clear slot configured as the always-visible close button with the localized Close label. The collapsed trigger is absent.
- The close control remains a native button with `type="button"`, stays keyboard reachable, and is disabled with the field. It is not hidden when the draft is empty. The existing `IconCircleXmark16` clear glyph is the intended close affordance.
- Styling handles only the wrapper, disclosure layout, and any necessary slot sizing. All colors, typography, control dimensions, focus indication, and state styles come from existing components and tokens.

Widen `SearchInput.slotProps.clearButton` from `IconButtonProps` to the existing `FormFieldClearButtonProps` so `isHidden` and `isClearable` are typed accurately. This is a type-only widening, not a runtime change. SearchExpandable maps its `closeButton` slot to this clear slot with `isHidden={false}` and `excludeFromTabOrder={false}`; no cast or duplicate close button is used. Regenerate both affected API reports.

## Value and timing model

Maintain three related pieces of state:

1. The controlled/uncontrolled committed model value.
2. An immediate draft passed to `SearchInput`.
3. A ref containing the last value exchanged with the consumer, used to suppress duplicate callbacks without suppressing legitimate retyping after an external reset.

### Typing and debounce

- Every input change updates the draft immediately.
- Outside Enter mode, each keystroke cancels/restarts the pending debounce using the current `emitValueTimeout`.
- When the timer fires, call `onChange` only if the value differs from the last exchanged value. In uncontrolled mode, also update the internal committed value.
- In controlled mode, the parent may accept or ignore `onChange`; the already-displayed draft does not freeze or roll back merely because the parent did not update the prop.
- An actual subsequent controlled prop write replaces the draft, updates the last-exchanged marker, cancels an older timer, and produces no echo.
- Empty external writes never collapse the field.

### Enter mode

- Typing updates only the draft and never starts the public debounce.
- Enter prevents the native form submission, cancels any stale timer, and immediately commits the current draft if changed.
- Without Enter mode, the component neither prevents Enter nor commits on it.
- Use `event.isComposing || event.keyCode === 229` to avoid committing an IME confirmation. The custom Enter handler prevents the default action but does not emit while composition is active.
- Do not pass a second `onSubmit` into React Aria that could duplicate the custom handler.

### Collapse/reset

- Close-button activation, Escape in the input, and `toggle()` are user/component-initiated close paths.
- Each close path cancels pending emission, clears the draft immediately, updates the uncontrolled committed value, and calls `onChange('')` synchronously even if the previous value was already empty.
- Reset is the only duplicate-emission exception and is emitted once per close action.
- If a controlled parent keeps a nonempty `value` after `onChange('')`, the internal draft remains cleared and the component does not immediately reopen. Only a real later prop write can trigger automatic expansion again.
- Closing solely because the `isOpen` prop changed preserves the draft and committed value but cancels a pending debounce. No hidden-field `onChange` fires after that close, and the canceled draft cannot reopen the component. Reopening restores the preserved, possibly uncommitted text; it is committed only by a later input action or Enter according to the active mode.

## Open-state model

- Collapsed-button activation and `toggle()` request open/close through `useControlledState`; uncontrolled state changes directly and controlled state reports the request.
- `toggle()` is a no-op while disabled and suppresses the collapsed-button tooltip during the transition.
- A nonempty external model write while collapsed and enabled:
  - opens an uncontrolled-open component and emits `onOpenChange(true)`;
  - emits only the request `onOpenChange(true)` for controlled-open; the component opens only if the parent applies it.
- A later model write while disabled does not automatically open the component or request opening.
- An initial nonempty value opens uncontrolled-open even when initially disabled or `defaultOpen={false}`, matching the specification's initial-seed exception. If the initial value caused the opening, `onOpenChange(true)` fires once after mount without moving focus.
- Controlled `isOpen` always wins on initial render. With `isOpen={false}` and an initial nonempty value, only the open request is emitted; this initial request also fires when initially disabled. With `isOpen={true}`, no mount callback is emitted.
- An initial `defaultOpen={true}` does not itself emit `onOpenChange`.
- Changes to the `isOpen` prop never clear the query and never echo through `onOpenChange`.
- Disabling an expanded field leaves it expanded with disabled input and close button. It intentionally cannot be closed by the user until it is re-enabled or the parent closes it through `isOpen`; disabling never forces a close.

## Focus and tooltip

Use refs plus an isomorphic layout effect that can distinguish the initial render from a later collapsed/expanded DOM transition.

- Initial collapsed or expanded rendering does not move focus.
- Opening after mount through the collapsed button, `toggle()`, or an external `isOpen` change focuses the enabled input.
- Automatic opening from a model value focuses the input only if focus was already inside the component; otherwise focus stays where it was.
- Closing after mount by any path, including external `isOpen`, focuses the enabled collapsed button. A disabled transition does not move focus.
- Returning focus to the collapsed button must not open its tooltip. Temporarily suppress only that focus-triggered tooltip behavior, then restore normal hover/focus behavior.
- Disabled components do not focus either control and do not show the tooltip.
- The root tracks whether focus was inside it; no Angular focus-origin API is reproduced.

## Keyboard composition with SearchInput

React Aria clears a nonempty search field on Escape before calling the consumer's `onKeyDown`. The component's handlers must account for that order:

- Let the internal clear update the draft, but cancel the debounce it may have scheduled.
- The SearchExpandable Escape handler then performs the single forced reset/close and prevents the default action so an enclosing modal remains open.
- Empty-input Escape also closes through the SearchExpandable handler.
- The configured close button may run React Aria's clear handler first; the SearchExpandable press handler then performs the same single forced reset/close. Tests must prove there is no duplicate `onChange('')`.

Escape on the collapsed trigger or close button is not handled by SearchExpandable.

## Localization and accessibility

- Add `intl.json` with both `en-US` (`Search`, `Close`) and `ru-RU` (`Поиск`, `Закрыть`).
- Read strings with `useLocalizedStringFormatter`; changing the `Provider` locale rerenders the labels.
- Follow the repository/React Aria locale fallback when no `Provider` exists rather than introducing an Angular-only forced-Russian DI fallback.
- The collapsed button name comes from `tooltipText`; the input name comes from `placeholder`; the close button name comes from the Close locale string or its slot override.
- The compact component intentionally has no visible label: the specification explicitly requires the placeholder-derived `aria-label`.
- Add `aria-expanded` to the disclosure trigger. Use a generated id for `aria-controls` only when the controlled target can be represented without dangling references.
- Add automated axe checks for collapsed, expanded, and two expanded instances. The new `axe-core` dependency is development-only.

React validation and native form behavior replace Angular touched/dirty/error-matcher contracts. `SearchInput`/React Aria supplies `aria-invalid`, validation props, and error rendering; no Angular control-state facade is added.

## Files and documentation

Create `packages/components/src/components/SearchExpandable/` with:

- `SearchExpandable.tsx`, `types.ts`, `index.ts`, `SearchExpandable.module.css`, `intl.json`;
- `SearchExpandable.test.tsx`;
- `SearchExpandable.stories.tsx`, `SearchExpandable.mdx`;
- `SearchExpandable.e2e.stories.tsx`, `SearchExpandable.e2e.ts`, and Docker-generated light/dark baselines.

Update `SearchInput/types.ts` with the clear-slot type widening described above. Update the component barrel and `tools/api-extractor/config.json`; generate both `SearchExpandable.api.md` and the updated `SearchInput.api.md` through the standard build/approve commands. No new package entry point is needed.

Storybook gets `Components/SearchExpandable`, `status:new`, `date:2026-11-11`, and an experimental status in MDX. Stories cover basic use, controlled value/open state, debounce, Enter mode, disabled, and custom labels. Data and helpers used by a story remain inside its named `render` function.

## Verification

Unit tests use Testing Library, `userEvent`, and fake timers for at least:

- initial collapsed/expanded rendering and root state attributes;
- controlled/uncontrolled value and open behavior, including controlled-open priority;
- default/custom/restarted debounce and cancellation;
- duplicate suppression, external writes, retyping, and forced empty reset;
- Enter on/off behavior and IME composition;
- close, Escape, `toggle()`, modal Escape behavior, and pending-timer cancellation;
- external close preserving text while canceling its pending emission and preventing automatic reopening;
- initial/later model expansion and disabled cases, including the initial controlled disabled open request;
- expanded-disabled remaining open until external close or re-enable;
- all focus transitions and tooltip suppression;
- disabled state, tab index normalization, native form props, and validation;
- both locales, runtime locale changes, custom/fallback labels, and ref forwarding;
- axe checks for collapsed, expanded, and two expanded instances.

Run the component and SearchInput unit tests, package type-check, ESLint, Stylelint, Prettier check, build, API approval/check, and Storybook/e2e build. Run screenshot tests and generate baselines only through the repository Docker commands. Exercise the actual Storybook scenarios, not just imports or compilation. Any environment-blocked check is reported explicitly rather than treated as passing.

## Decisions left to the builder

- Exact CSS layout declarations and the existing IconButton/SearchInput variants that best match the library.
- Whether small internal helpers are needed to keep the main file focused.
- Exact test grouping and fake-timer helpers, following nearby tests.
- Internal ref/effect bookkeeping, provided every public rule above is covered and Strict Mode does not duplicate callbacks.
- The smallest compatible `axe-core` development dependency version supported by the existing Node/pnpm toolchain; no runtime dependency or unrelated dependency updates.

## Builder-check resolutions

- The external-close debounce rule was chosen by the user: cancel the pending emission, preserve the draft, and never reopen from that canceled draft.
- The `FormFieldClearButtonProps` widening, CircleXmark close glyph, disabled-expanded behavior, self-contained contract, and initial controlled-disabled request are design decisions made during the builder check; they do not require further product choices.
