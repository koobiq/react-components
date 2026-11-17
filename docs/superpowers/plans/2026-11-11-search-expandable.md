# SearchExpandable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a localized, accessible `SearchExpandable` with controlled/uncontrolled value and disclosure, debounced or Enter-driven commits, exact reset/focus behavior, documentation, screenshots, and guarded public API.

**Architecture:** Compose the existing `SearchInput`, `IconButton`, and `Tooltip`. Keep the displayed draft separate from the committed model, use a small internal value hook for debounce/reset/external synchronization, and coordinate disclosure plus focus in the styled component. Widen only the existing SearchInput clear-slot type; do not change its runtime behavior.

**Tech Stack:** TypeScript 6, React 18/19, React Aria through Koobiq core/primitives, CSS Modules, Vitest + Testing Library, axe-core (dev-only), Storybook 10, Playwright/Docker, API Extractor.

**Spec:** `docs/superpowers/specs/2026-11-11-search-expandable-design.md` — the complete implementation contract; the original Angular specification is not needed by the executor.

## Global Constraints

- Public `onChange` is debounced by `200` ms by default or immediate in Enter mode; there is no separate public immediate event.
- Controlled `isOpen={false}` always wins over automatic expansion; a nonempty value only requests opening through `onOpenChange(true)` in controlled mode.
- User close clears and force-emits `''` once; external close preserves the draft/value but cancels pending emission and must not reopen.
- Import React Aria only through `@koobiq/react-core` / `@koobiq/react-primitives`; keep `'use client'`, `displayName`, CSS Modules, logical CSS, tokens, JSDoc, and `data-*` conventions.
- Locale strings are `Search`/`Close` and `Поиск`/`Закрыть`; use the repository Provider/React Aria locale fallback.
- `axe-core` is a development-only dependency. No runtime dependency or unrelated dependency updates.
- Generate screenshots only with the Docker e2e commands. Never edit generated API reports directly.
- Do not run `git commit`, push, or other git-mutating commands unless the user explicitly requests them. Each task ends with a diff review instead.
- Leave unrelated failures and files alone; report any environment-blocked verification explicitly.

## Review Focus

- **External close during debounce:** the hidden field must neither emit later nor reopen; Task 3 adds the close/reopen regression test.
- **Controlled parent ignores a callback:** the draft must remain responsive, and a stale nonempty prop after ignored `onChange('')` must not reopen; Tasks 2 and 3 pin both cases.
- **IME confirmation:** Enter with `isComposing` or `keyCode === 229` must not commit incomplete text; Task 2 covers both inputs.
- **Strict Mode effect replay:** initial open callbacks must fire once and initial rendering must not steal focus; Tasks 3 and 4 run the relevant assertions inside `StrictMode`.
- **Multiple expanded instances:** accessible names/ids must remain valid and axe must report no violations; Task 4 renders two expanded instances together.

---

### Task 1: Public types and collapsed/expanded scaffold

**Files:**

- Create: `packages/components/src/components/SearchExpandable/types.ts`
- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.tsx`
- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.module.css`
- Create: `packages/components/src/components/SearchExpandable/intl.json`
- Create: `packages/components/src/components/SearchExpandable/index.ts`
- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`
- Modify: `packages/components/src/components/SearchInput/types.ts`
- Modify: `packages/components/src/components/index.ts`

**Interfaces:**

- Consumes: existing `SearchInputProps`, `FormFieldClearButtonProps`, `IconButtonProps`, `FormFieldInputProps`, `TooltipProps`, `useLocalizedStringFormatter`, and icons.
- Produces:
  - `SearchExpandable`, `SearchExpandableProps`, `SearchExpandableRef`.
  - `searchExpandableDefaultValue = ''` and `searchExpandableDefaultEmitValueTimeout = 200`.
  - `SearchExpandableRef = { element: HTMLDivElement | null; toggle: () => void }`.
  - Value props `value?: string | null`, `defaultValue?: string`, `onChange?: (value: string) => void`.
  - Disclosure props `isOpen?: boolean`, `defaultOpen?: boolean`, `onOpenChange?: (isOpen: boolean) => void`.
  - `emitValueTimeout?: number`, `isEmitValueByEnterEnabled?: boolean`, `tooltipText?: string | null`, `placeholder?: string | null`, `isDisabled?: boolean`, `tabIndex?: number | null`.
  - `slotProps.button`, `slotProps.tooltip`, `slotProps.input`, `slotProps.closeButton`; owned behavior props are omitted or overridden internally.
  - Relevant SearchInput field/form props remain available; owned value, addons, label, keyboard, submit/clear, root class/style/test-id, and SearchInput slot props are omitted.
  - `SearchInputProps['slotProps']['clearButton']` accepts `FormFieldClearButtonProps` instead of only `IconButtonProps`.

- [ ] **Step 1: Write failing scaffold tests**

In `SearchExpandable.test.tsx`, use `<Provider locale="en-US">` and test:

- initial rendering has a button named `Search`, `type="button"`, no textbox, root `data-slot="search-expandable"`, merged custom class/style/test id, and no `data-open`;
- clicking the trigger renders a textbox named `Search` with `type="text"` and `autocomplete="off"`, removes the trigger, and sets `data-open="true"`;
- the empty expanded field still has a keyboard-reachable native button named `Close` with `type="button"`;
- `ref.current.element` is the root div.

- [ ] **Step 2: Run the tests and confirm the expected failure**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`
Expected: FAIL because `./index` / `SearchExpandable` does not exist.

- [ ] **Step 3: Implement the public types and minimal rendering**

Create the types/constants above with complete JSDoc. Change SearchInput's clear-slot type to `FormFieldClearButtonProps`. Implement conditional Tooltip + IconButton / SearchInput rendering, `intl.json`, token-based logical CSS, root state attributes, `data-slot`, and `element` in `useImperativeHandle`. Map `slotProps.closeButton` to SearchInput's clear slot with `isHidden={false}`, `excludeFromTabOrder={false}`, localized label, and `IconCircleXmark16` already supplied by SearchInput. Add local and root barrel exports. Leave `toggle` and handlers temporarily minimal; later tasks own their exact behavior.

- [ ] **Step 4: Run scaffold and existing SearchInput tests**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx packages/components/src/components/SearchInput/SearchInput.test.tsx`
Expected: PASS.

- [ ] **Step 5: Type-check and review the task diff**

Run: `pnpm --filter @koobiq/react-components type-check`
Expected: PASS, including typed `isHidden`/`isClearable` use through the widened SearchInput slot.
Run: `git diff -- packages/components/src/components/SearchExpandable packages/components/src/components/SearchInput/types.ts packages/components/src/components/index.ts`
Expected: only Task 1 files; no generated API report edited by hand.

### Task 2: Draft, committed value, debounce, Enter, and reset pipeline

**Files:**

- Create: `packages/components/src/components/SearchExpandable/useSearchExpandableValue.ts`
- Modify: `packages/components/src/components/SearchExpandable/SearchExpandable.tsx`
- Modify: `packages/components/src/components/SearchExpandable/types.ts` only if internal option types need explicit documentation
- Test: `packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`

**Interfaces:**

- Consumes: Task 1 public value props and `useDebounceCallback` / `useControlledState` from core.
- Produces the internal hook:

```ts
type UseSearchExpandableValueOptions = {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  emitValueTimeout?: number;
  isEmitValueByEnterEnabled?: boolean;
  onExternalValue?: (value: string) => void;
};

type UseSearchExpandableValueResult = {
  draftValue: string;
  handleDraftChange: (value: string) => void;
  commitDraft: () => void;
  resetValue: () => void;
  cancelPendingEmit: () => void;
};
```

- `handleDraftChange` updates immediately and schedules only outside Enter mode.
- `commitDraft` immediately commits the current draft only when changed.
- `resetValue` cancels pending work, clears immediately, and force-commits `''` once.
- `onExternalValue` runs only for an actual post-mount controlled prop write, never for the hook's own uncontrolled commit.

- [ ] **Step 1: Add failing timing and value tests**

Use fake timers with `userEvent` configured to advance them and assert:

- `typed` is visible immediately but `onChange` is absent at `0`/`199` ms and receives `typed` at `200` ms;
- `emitValueTimeout={500}` has no emission at `300` ms and emits at `500`; a changed timeout applies to the next keystroke;
- a second keystroke restarts the delay and only final text is emitted;
- Enter mode emits nothing after `300` ms of typing, then emits immediately on Enter with `defaultPrevented === true`; without Enter mode it neither prevents default nor emits immediately;
- Enter with `isComposing` and separately `keyCode === 229` prevents default but does not emit;
- repeated unchanged Enter does not emit again; retyping after an external `''` write does emit;
- an external controlled write updates the draft, cancels older pending text, and causes no echo; `null` displays empty;
- a controlled parent that ignores `onChange` still sees the typed draft immediately;
- close and Escape each produce exactly one synchronous `onChange('')`, even from an already empty model, and a canceled timer never restores discarded text;
- the native close button closes via both Enter and Space without a custom keyboard handler.

- [ ] **Step 2: Run the new tests and confirm timing/value failures**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`
Expected: FAIL on debounce, external synchronization, Enter, and exact reset assertions.

- [ ] **Step 3: Implement `useSearchExpandableValue`**

Normalize `null` to `''` and initialize from controlled `value` when defined, otherwise `defaultValue`. Keep committed model, immediate draft, a current-draft ref, and a last-exchanged-value ref. Compare the normalized controlled value with its previous value inside an isomorphic layout effect so mount/Strict Mode replay is a no-op and every real write cancels pending work, updates draft/last-exchanged, and calls `onExternalValue` exactly once. Use the current `emitValueTimeout` on every `handleDraftChange`; no leading call. Commit only changed values except `resetValue`, which forces one empty callback and updates the uncontrolled model.

- [ ] **Step 4: Wire keyboard and close composition without duplicate events**

Pass the draft as SearchInput's controlled value. Do not pass React Aria an `onSubmit`. In the input keydown handler, implement Enter mode with `event.isComposing || event.keyCode === 229`; outside Enter mode leave Enter untouched. Account for React Aria clearing nonempty text before the consumer Escape handler, then cancel and call the single reset/close path. Use the same reset path for the clear-slot press after its internal clear. Preserve the caller's chained slot handlers.

- [ ] **Step 5: Run tests and review the task diff**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`
Expected: all value/timing/reset tests PASS.
Run: `git diff -- packages/components/src/components/SearchExpandable`
Expected: only the value hook, wiring, types if needed, and tests.

### Task 3: Controlled disclosure, automatic opening, toggle, and disabled transitions

**Files:**

- Modify: `packages/components/src/components/SearchExpandable/SearchExpandable.tsx`
- Test: `packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`

**Interfaces:**

- Consumes: Task 2 `onExternalValue`, `resetValue`, `cancelPendingEmit`; Task 1 disclosure props/ref.
- Produces: exact open-state behavior and `SearchExpandableRef.toggle(): void`; no additional public API.

- [ ] **Step 1: Add failing controlled/uncontrolled disclosure tests**

Assert:

- trigger/close callbacks are `true`/`false`; a controlled parent that ignores `onOpenChange` does not change rendering, and rerendering with a new `isOpen` does not echo;
- initial nonempty uncontrolled value opens even with `defaultOpen={false}` or initial disabled and emits one `onOpenChange(true)`; `defaultOpen` alone does not emit;
- controlled `isOpen={false}` plus initial nonempty value stays closed and emits one open request, including initial disabled; controlled `isOpen={true}` emits nothing on mount;
- later nonempty writes open uncontrolled-open or only request controlled-open; empty writes never collapse; later writes while disabled do neither;
- external close preserves the exact draft but cancels its pending emission, and advancing beyond the timeout causes neither `onChange` nor reopening; reopening shows the preserved text;
- a controlled parent that ignores `onChange('')` does not cause an immediate reopen from the stale prop;
- `ref.toggle()` switches uncontrolled state and emits, while disabled toggle/click/Escape do nothing;
- disabling an expanded field leaves it expanded with disabled input and close button until re-enabled or externally closed;
- `tabIndex` defaults to `0`, accepts a finite number, falls back for `null`/`NaN`, and becomes `-1` while disabled.

Wrap the initial-callback cases in `StrictMode` and assert exactly one callback.

- [ ] **Step 2: Run disclosure tests and confirm failures**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`
Expected: FAIL on initial/controlled priority, external-close cancellation, toggle, and disabled/tab-index cases.

- [ ] **Step 3: Implement disclosure and automatic-open rules**

Use `useControlledState(isOpenProp, defaultOpen || initialValue !== '', onOpenChange)`. Handle initial model-driven open requests with a mount guard that survives Strict Mode replay. In `onExternalValue`, request/open only for nonempty writes while closed and enabled; controlled mode invokes only `onOpenChange(true)`. Track actual open transitions with a previous-value comparison, cancel pending emission on every post-mount transition to closed, and never derive value clearing from an `isOpen` effect. Implement user open/close and imperative toggle explicitly so controlled semantics and forced reset remain distinct.

- [ ] **Step 4: Implement disabled and tab-index normalization**

Resolve `isDisabled` from props or repository `Form` context. Disable trigger/input/close/tooltip and block all component-initiated transitions while leaving external `isOpen` effective. Normalize null/non-finite tab indices to `0`, force `-1` while disabled, and apply the value only to trigger and input.

- [ ] **Step 5: Run disclosure and regression tests**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx packages/components/src/components/SearchInput/SearchInput.test.tsx`
Expected: PASS.

### Task 4: Focus, tooltip suppression, localization, forms, and axe accessibility

**Files:**

- Modify: `packages/components/src/components/SearchExpandable/SearchExpandable.tsx`
- Modify: `packages/components/src/components/SearchExpandable/SearchExpandable.module.css` only if focus/tooltip integration requires styling
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Test: `packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`

**Interfaces:**

- Consumes: all earlier state handlers, `Tooltip.control`, merged refs, `Provider`, SearchInput form/validation props, and dev-only `axe-core`.
- Produces: complete focus/localization/accessibility behavior; no new public API.

- [ ] **Step 1: Add the approved test-only dependency**

Run: `pnpm add --save-dev --save-exact axe-core --workspace-root`
Expected: only root `package.json` and `pnpm-lock.yaml` record axe-core and its required dependency resolution; no runtime package manifest changes.

- [ ] **Step 2: Add failing focus, tooltip, locale, form, and axe tests**

Assert:

- initial collapsed and expanded renders, including Strict Mode, do not move focus;
- click/toggle/external opening focuses enabled input; disabled external opening does not;
- model-driven opening focuses input only when the collapsed trigger/root already contained focus;
- close/Escape/toggle/external close focuses the enabled collapsed button, while disabled collapse does not;
- programmatic focus restoration does not open the tooltip, subsequent normal focus/hover behavior still works, and disabled tooltip never opens;
- hovering the collapsed trigger actually displays the current `tooltipText`, and expanding removes that tooltip;
- ru-RU/en-US strings and runtime Provider locale changes; custom `tooltipText`/`placeholder`, null/undefined locale fallback, preserved empty strings, and close-button slot label override;
- forwarded `name`, required/invalid props, error message, `aria-invalid`, and Form disabled context;
- input Escape closes only SearchExpandable inside a Modal, and a subsequent Escape on the collapsed trigger can close the Modal;
- `await axe.run(container)` returns `violations: []` for collapsed, expanded, and two expanded instances.

- [ ] **Step 3: Run the tests and confirm the remaining failures**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx`
Expected: FAIL on unfinished focus/tooltip behavior; any axe infrastructure error must be fixed rather than hidden by disabling rules.

- [ ] **Step 4: Implement deterministic focus and tooltip restoration**

Merge root, input, trigger, and Tooltip refs without replacing the Tooltip ref. Use previous-render comparisons and a focus-cause ref (`user`, `external`, or `model`) to distinguish mount from later transitions. Record whether the root contained focus before a model-driven open. For collapse, use a two-phase layout update: first render the newly collapsed trigger with tooltip opening suppressed/controlled closed, then focus the enabled trigger and restore normal tooltip behavior. Do not use arbitrary sleep-based suppression. No focus call occurs while disabled or on initial render.

- [ ] **Step 5: Complete labels, form forwarding, and accessibility wiring**

Use `tooltipText ?? t.format('search')` and the equivalent placeholder fallback so `''` survives. Apply localized accessible names and the close slot override, `aria-expanded`, and a generated non-dangling `aria-controls` relationship where possible. Forward only the approved field/form props. Keep native buttons and React Aria validation; do not add an Angular touched/dirty facade.

- [ ] **Step 6: Run the complete unit suite for both affected components**

Run: `pnpm vitest run packages/components/src/components/SearchExpandable/SearchExpandable.test.tsx packages/components/src/components/SearchInput/SearchInput.test.tsx`
Expected: PASS, including all three axe scenarios without disabling any axe rules.

### Task 5: Storybook documentation and Docker screenshot coverage

**Files:**

- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.stories.tsx`
- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.mdx`
- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.e2e.stories.tsx`
- Create: `packages/components/src/components/SearchExpandable/SearchExpandable.e2e.ts`
- Create: `packages/components/src/components/SearchExpandable/__screenshots__/01-light.png`
- Create: `packages/components/src/components/SearchExpandable/__screenshots__/01-dark.png`
- Modify: generated `llms.txt` only if `pnpm build-storybook` updates it for the new documentation page

**Interfaces:**

- Consumes: the completed public component from Tasks 1–4 and existing `E2eGrid`, `e2eGotoStory`, `e2eScreenshotThemes` helpers.
- Produces: public Storybook examples and one light/dark visual baseline pair; no API changes.

- [ ] **Step 1: Add public stories and MDX**

Use `title: 'Components/SearchExpandable'`, `tags: ['status:new', 'date:2026-11-11']`, and named render functions where hooks are used. Add `Base`, `Controlled`, `Debounce`, `EnterMode`, `Disabled`, and `CustomLabels`; keep example state/helpers inside `render`. Follow the MDX order Meta/title/experimental Status/description/Import/Usage/Props, then feature sections that explain delayed `onChange`, controlled-open priority, reset versus external close, and Enter mode.

- [ ] **Step 2: Add the minimal e2e story and spec**

Create `E2E/SearchExpandable` with `tags: ['!dev', '!manifest']` and an `E2eGrid` containing collapsed, expanded empty, expanded with value, disabled collapsed, and disabled expanded states. Give the grid the standard screenshot target. In `SearchExpandable.e2e.ts`, open `e2e-searchexpandable--state-and-style` and call `e2eScreenshotThemes(page, '01')`.

- [ ] **Step 3: Build and exercise the actual Storybook scenarios**

Run `pnpm storybook` as a background task. In the built-in browser, open `Components/SearchExpandable` and verify the real Base, Controlled, Debounce, EnterMode, Disabled, and CustomLabels interactions, including visible focus transfer and locale toolbar changes. Stop the server afterward. Expected: no console errors and behavior matching the unit-tested contract.

- [ ] **Step 4: Generate and inspect Docker baselines**

Run: `pnpm e2e:docker:update-snapshots -g SearchExpandable`
Expected: only `01-light.png` and `01-dark.png` are created for this component. Inspect both images for layout, icons, close visibility, disabled state, clipping, and light/dark token correctness.

- [ ] **Step 5: Run e2e and the documentation build**

Run: `pnpm e2e:docker -g SearchExpandable`
Expected: SearchExpandable light/dark screenshot comparisons PASS with threshold `0`.
Run: `pnpm build-storybook`
Expected: PASS; retain only relevant generated llms.txt changes and remove incidental build/test artifacts not intended for the change.

### Task 6: API reports, formatting, and full verification

**Files:**

- Modify: `tools/api-extractor/config.json`
- Create: `tools/public_api_guard/components/SearchExpandable.api.md` using API Extractor only
- Modify: `tools/public_api_guard/components/SearchInput.api.md` using API Extractor only
- Modify: only files with formatting/lint corrections from earlier tasks

**Interfaces:**

- Consumes: the completed public surface and documentation.
- Produces: CI-checkable API reports and the final verified change set.

- [ ] **Step 1: Register the component and format/lint the touched files**

Add `"SearchExpandable"` immediately after `"SearchInput"` in `tools/api-extractor/config.json`. Run Prettier with explicit touched-file paths from Bash, then targeted ESLint/Stylelint fixes. Expected: no warnings or unrelated reformatting; review comments/docstrings for consistency with final behavior.

- [ ] **Step 2: Build package declarations for API Extractor**

First try the standard command: `pnpm build`.
If this Windows host fails on the documented `rm -rf dist/node_modules` cmd.exe incompatibility, run from Bash in dependency order for `logger`, `core`, `primitives`, `components`:

```bash
cd packages/<package> && pnpm exec vite build && pnpm exec tsc -p tsconfig.build.json && rm -rf dist/node_modules
```

Expected: fresh `dist` declarations for every package; do not treat a failed standard build as a successful fallback unless all four package builds pass.

- [ ] **Step 3: Generate and check both API reports**

Run: `pnpm approve-api SearchExpandable`
Run: `pnpm approve-api SearchInput`
Run: `pnpm check-api`
Expected: PASS; SearchExpandable contains only the agreed public API, and SearchInput differs only in the clear-slot prop type.

- [ ] **Step 4: Run the repository verification suite**

Run each command and record its actual result:

- `pnpm vitest run`
- `pnpm type-check`
- `pnpm lint:js --max-warnings=0`
- `pnpm lint:css --max-warnings=0`
- `pnpm format:check`
- `pnpm check-api`
- `pnpm e2e:docker -g SearchExpandable`

Expected: all applicable commands PASS. If Docker or another environment facility is unavailable, finish every unblocked check and report the blocked one plainly rather than claiming completion.

- [ ] **Step 5: Inspect the final deliverable and clean generated artifacts**

Run: `git status --short` and review `git diff --stat` plus the component/API diffs. Confirm the final set contains the design/plan docs, component, tests, stories, screenshots, SearchInput type widening, axe-core dev dependency, exports/config, and generated API reports. Delete only artifacts created by this run that are not needed; leave pre-existing files and unrelated failures alone. Do not commit unless the user explicitly asks.
