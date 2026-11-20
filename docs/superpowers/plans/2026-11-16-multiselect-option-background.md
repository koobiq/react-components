# Multiselect Option Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the selected-option background in multiple-selection `SelectNext` and `TreeSelect` dropdowns while preserving interaction backgrounds and every other component's appearance.

**Architecture:** The shared list-item CSS resolves three internal selected-state variables with the existing design tokens as fallbacks. Only the multiselect roots in `SelectNext` and `TreeSelect` override those inherited variables; all other consumers retain the fallback values.

**Tech Stack:** React 19, TypeScript 6, CSS Modules, design-token CSS custom properties, Vitest, Playwright screenshot tests in Docker.

**Spec:** `docs/superpowers/specs/2026-11-16-multiselect-option-background-design.md`

## Global Constraints

- Change only multiple-selection dropdowns in `SelectNext` and `TreeSelect`.
- Preserve single-selection styling and do not change `List`, `Tree`, `DropdownMenu`, deprecated `Select`, or `TagAutocomplete`.
- Do not change the public component API or generated API reports.
- Use `--kbq-states-background-transparent-hover` for selected hover parity and `--kbq-states-background-transparent-active` for selected pressed parity.
- Use logical CSS properties and the repository's existing CSS Modules conventions.
- Generate or update screenshot baselines only through the Docker e2e commands.
- Do not run `git commit` or `git push` unless the user explicitly requests it.

## Review Focus

- Single-selection selected options must keep their current fill: the existing `SelectNext` and `TreeSelect` `open` screenshot tests pin this in Tasks 1–3.
- `List`, `Tree`, and `DropdownMenu` must keep their current selected fills: their existing screenshot tests pin this in Task 1.
- Disabled selected options must have the same transparent fill as disabled unselected options: the new computed-background checks pin this in Tasks 2 and 3.
- Selected hover and pressed backgrounds must equal unselected hover and pressed backgrounds: the new real-pointer checks pin this in Tasks 2 and 3.
- A keyboard-focused selected option must retain its outline without acquiring a selected fill: the new focus checks pin this in Tasks 2 and 3.

---

### Task 1: Shared selected-state variables

**Files:**

- Modify: `packages/components/src/styles/utility.module.css:478-520` (including the disabled-selected declaration)
- Test: `packages/components/src/components/List/List.e2e.ts`
- Test: `packages/components/src/components/Tree/Tree.e2e.ts`
- Test: `packages/components/src/components/DropdownMenu/DropdownMenu.e2e.ts`
- Test: `packages/components/src/components/SelectNext/SelectNext.e2e.ts`
- Test: `packages/components/src/components/TreeSelect/TreeSelect.e2e.ts`

**Interfaces:**

- Consumes: existing `--list-item-bg-color` state assignments and `--kbq-*` design tokens.
- Produces: inherited optional variables `--list-item-selected-bg-color`, `--list-item-selected-hover-bg-color`, and `--list-item-selected-active-bg-color`; when unset, every rule resolves to its current token.

- [ ] **Step 1: Establish the unchanged-behavior baseline**

Run: `pnpm e2e:docker -g "^(List|Tree|DropdownMenu|SelectNext|TreeSelect)"`
Expected: PASS with no screenshot differences.

- [ ] **Step 2: Route selected backgrounds through the three variables**

In `utility.module.css`, change only the selected resting, selected hovered, selected pressed, and disabled-selected assignments. Single-selection rules use the corresponding new variable with the current `--kbq-*-theme-less*` token as fallback; multiple-selection rules use the same variable with the current `--kbq-*-contrast-less*` token as fallback. The disabled-selected rule resolves `--list-item-selected-bg-color` with its current `--kbq-background-theme-less` token as fallback, so an empty override also removes its fill. Do not alter selectors, the general disabled rule, focus outlines, or border-radius rules.

- [ ] **Step 3: Verify that the refactor is visually neutral**

Run: `pnpm e2e:docker -g "^(List|Tree|DropdownMenu|SelectNext|TreeSelect)"`
Expected: PASS with no screenshot differences and no baseline rewrites.

### Task 2: SelectNext multiselect appearance

**Files:**

- Modify: `packages/components/src/components/SelectNext/Select.module.css:50-57`
- Modify: `packages/components/src/components/SelectNext/SelectNext.e2e.stories.tsx`
- Modify: `packages/components/src/components/SelectNext/SelectNext.e2e.ts`
- Create: `packages/components/src/components/SelectNext/__screenshots__/03-light.png`
- Create: `packages/components/src/components/SelectNext/__screenshots__/03-dark.png`

**Interfaces:**

- Consumes: the three selected-state variables produced by Task 1 and the list root's existing `aria-multiselectable="true"` attribute.
- Produces: a multiselect-only override on `.list[aria-multiselectable='true']`; the hidden story ID is `e2e-selectnext--open-multiple`, and its screenshot target remains the popover.

- [ ] **Step 1: Add the failing multiple-selection browser checks**

Add an `OpenMultiple` story with `selectionMode="multiple"`, `defaultOpen`, and test IDs for selected, unselected, disabled-selected, and disabled-unselected leaf options. Keep the existing single-selection `Open` story unchanged.

In `SelectNext.e2e.ts`, add `open multiple` for `e2eScreenshotThemes(page, '03')` and `multiple option backgrounds`. In the latter, use `getComputedStyle(element, '::before').backgroundColor` inside locator evaluation and assert:

- resting selected equals resting unselected;
- disabled selected equals disabled unselected;
- after actual pointer hover, selected hover equals unselected hover;
- after actual pointer press, selected pressed equals unselected pressed;
- after keyboard focus, the selected option has `data-focus-visible="true"`, its background equals an unselected option's, and its `::before` outline color is not transparent.

Wait for the relevant React Aria `data-hovered`, `data-pressed`, or `data-focus-visible` attribute before reading styles. Keep browser callbacks independent of outer variables.

- [ ] **Step 2: Run the behavior check before the CSS override**

Run: `pnpm e2e:docker -g "^SelectNext multiple option backgrounds"`
Expected: FAIL because selected and unselected backgrounds still differ.

- [ ] **Step 3: Override the variables only on the multiple-selection list**

In `Select.module.css`, scope three declarations to `.list[aria-multiselectable='true']`: an empty `--list-item-selected-bg-color`, `--list-item-selected-hover-bg-color: var(--kbq-states-background-transparent-hover)`, and `--list-item-selected-active-bg-color: var(--kbq-states-background-transparent-active)`.

- [ ] **Step 4: Verify behavior and generate only the new SelectNext baselines**

Run: `pnpm e2e:docker -g "^SelectNext multiple option backgrounds"`
Expected: PASS.

Run: `pnpm e2e:docker:update-snapshots -g "^SelectNext open multiple"`
Expected: only `SelectNext/__screenshots__/03-light.png` and `03-dark.png` are created.

Run: `pnpm e2e:docker -g "^SelectNext"`
Expected: PASS, including unchanged single-selection `02` screenshots.

### Task 3: TreeSelect multiselect appearance

**Files:**

- Modify: `packages/components/src/components/TreeSelect/TreeSelect.module.css:72-80`
- Modify: `packages/components/src/components/TreeSelect/TreeSelect.e2e.stories.tsx`
- Modify: `packages/components/src/components/TreeSelect/TreeSelect.e2e.ts`
- Create: `packages/components/src/components/TreeSelect/__screenshots__/03-light.png`
- Create: `packages/components/src/components/TreeSelect/__screenshots__/03-dark.png`

**Interfaces:**

- Consumes: the three selected-state variables produced by Task 1 and the tree root's existing `data-selection-mode="multiple"` attribute.
- Produces: a multiselect-only override on `.tree[data-selection-mode='multiple']`; the hidden story ID is `e2e-treeselect--open-multiple`, and its screenshot target remains the popover.

- [ ] **Step 1: Add the equivalent failing TreeSelect browser checks**

Add an `OpenMultiple` story with selected, unselected, disabled-selected, and disabled-unselected leaf items. Keep the existing single-selection `Open` story and standalone `Tree` stories unchanged. Add the same five computed-background/outline assertions as Task 2, using `e2e-treeselect--open-multiple` and screenshot prefix `03`.

- [ ] **Step 2: Run the behavior check before the CSS override**

Run: `pnpm e2e:docker -g "^TreeSelect multiple option backgrounds"`
Expected: FAIL because selected and unselected backgrounds still differ.

- [ ] **Step 3: Override the variables only on the multiple-selection tree**

In `TreeSelect.module.css`, scope the same three declarations as Task 2 to `.tree[data-selection-mode='multiple']`. Do not put them on global `.kbq-Tree` or `.kbq-TreeItem` selectors.

- [ ] **Step 4: Verify behavior and generate only the new TreeSelect baselines**

Run: `pnpm e2e:docker -g "^TreeSelect multiple option backgrounds"`
Expected: PASS.

Run: `pnpm e2e:docker:update-snapshots -g "^TreeSelect open multiple"`
Expected: only `TreeSelect/__screenshots__/03-light.png` and `03-dark.png` are created.

Run: `pnpm e2e:docker -g "^(TreeSelect|Tree)"`
Expected: PASS, including unchanged single-selection `TreeSelect` and all `Tree` screenshots.

### Task 4: Final verification

**Files:**

- Verify all files above plus `docs/superpowers/specs/2026-11-16-multiselect-option-background-design.md` and this plan.

**Interfaces:**

- Consumes: the completed shared variables, two component overrides, and their browser coverage.
- Produces: a verified DS-5466 change set with no public API changes.

- [ ] **Step 1: Run unit tests and static checks**

Run: `pnpm vitest run SelectNext TreeSelect utility.test.ts`
Expected: PASS.

Run: `pnpm type-check`
Expected: PASS.

Run: `pnpm lint`
Expected: PASS with zero warnings.

Run: `pnpm format:check`
Expected: PASS.

- [ ] **Step 2: Run the complete affected browser suite**

Run: `pnpm e2e:docker -g "^(SelectNext|TreeSelect|List|Tree|DropdownMenu)"`
Expected: PASS with no unapproved screenshot changes.

- [ ] **Step 3: Audit the delivered diff**

Run: `git diff --check && git status --short`
Expected: no whitespace errors; only the design, plan, shared CSS, two components' CSS/e2e files, and four new `03` screenshots are present. No generated API report or unrelated baseline changed.
