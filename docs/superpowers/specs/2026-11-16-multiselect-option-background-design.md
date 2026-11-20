# DS-5466: Multiselect option background

## Intent

Update the dropdown options in `SelectNext` and `TreeSelect` to match the current multiselect design: selection is shown by the checkbox, not by a background fill. Selected and unselected options must use the same background in their resting, hover, pressed, focus, and disabled states.

## Scope

- Change only multiple-selection dropdowns in `SelectNext` and `TreeSelect`.
- Preserve single-selection styling in both components.
- Do not change `List`, `Tree`, `DropdownMenu`, deprecated `Select`, or `TagAutocomplete`.
- Do not change the public component API. Filter pipes do not exist in this repository, and `TagAutocomplete` suggestions use `selectionMode="none"`, so there is no selected-option background to update there.

## Approaches

### Local component overrides

Override `--list-item-bg-color` for every selected state in `SelectNext` and `TreeSelect`. This keeps the change inside two components but duplicates state rules and requires higher-specificity selectors whose correctness depends on the shared utility implementation.

### Shared selected-state variables (chosen)

Add internal `--list-item-selected-*-bg-color` customization points to the shared list-item styles, retaining every current color as its fallback. Override those variables only on the multiselect list roots in `SelectNext` and `TreeSelect`.

This avoids duplicating selectors, keeps the existing defaults for all other consumers, and does not rely on stylesheet order. The tradeoff is a small change to the shared utility that must be checked against existing `List`, `Tree`, and `DropdownMenu` screenshots.

## Design

In `packages/components/src/styles/utility.module.css`:

- Use `--list-item-selected-bg-color` for the selected resting background, falling back to the existing single- or multiple-selection token.
- Use `--list-item-selected-hover-bg-color` for selected + hovered, with the existing tokens as fallbacks.
- Use `--list-item-selected-active-bg-color` for selected + pressed, with the existing tokens as fallbacks.

On the `SelectNext` list root and the `TreeSelect` tree root, only when their selection mode is multiple:

- Set the selected resting background variable to an empty value so no background is painted.
- Set the selected hover variable to `--kbq-states-background-transparent-hover`.
- Set the selected active variable to `--kbq-states-background-transparent-active`.

The variables inherit into options. Because the existing disabled-selected rule also resolves the resting selected variable, disabled selected options lose their fill as well. Focus keeps its existing outline and otherwise follows the same background rules. Checkbox styling, adjacent-item border radii, layout, and selection behavior stay unchanged.

## Verification

- Keep the existing single-selection open-dropdown screenshots and add multiple-selection open-dropdown stories/specs for `SelectNext` and `TreeSelect`, with selected, unselected, and disabled options in light and dark themes.
- Regenerate the affected Docker Playwright baselines; verify that `List`, `Tree`, and `DropdownMenu` baselines remain unchanged.
- Run the related Vitest suites, type checking, ESLint/Stylelint, and formatting checks.
- No API report update is expected because only CSS and hidden e2e stories change.
