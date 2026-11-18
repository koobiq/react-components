import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('TreeSelect', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-treeselect--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-treeselect--open');
    await e2eScreenshotThemes(page, '02');
  });

  test('open multiple', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-treeselect--open-multiple');
    await e2eScreenshotThemes(page, '03');
  });

  test('multiple option backgrounds', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-treeselect--open-multiple');

    const selected = page.getByTestId('treeselect-option-selected');
    const unselected = page.getByTestId('treeselect-option-unselected');

    const disabledSelected = page.getByTestId(
      'treeselect-option-disabled-selected'
    );

    const disabledUnselected = page.getByTestId(
      'treeselect-option-disabled-unselected'
    );

    // The assertions compare the settled colors, so the transition of the item
    // background is turned off instead of waiting it out.
    await page.addStyleTag({
      content: '*::before { transition: none !important; }',
    });

    const getBackground = (locator: Locator) =>
      locator.evaluate(
        (el) => getComputedStyle(el, '::before').backgroundColor
      );

    // The background comparisons are only meaningful for known selection
    // states, so each row's state is asserted before anything is measured.
    await expect(selected).toHaveAttribute('data-selected', 'true');
    await expect(unselected).not.toHaveAttribute('data-selected', 'true');
    await expect(disabledSelected).toHaveAttribute('data-selected', 'true');
    await expect(disabledSelected).toHaveAttribute('data-disabled', 'true');

    await expect(disabledUnselected).not.toHaveAttribute(
      'data-selected',
      'true'
    );

    await expect(disabledUnselected).toHaveAttribute('data-disabled', 'true');

    const restingSelected = await getBackground(selected);
    const restingUnselected = await getBackground(unselected);
    expect(restingSelected).toBe(restingUnselected);

    const restingDisabledSelected = await getBackground(disabledSelected);
    const restingDisabledUnselected = await getBackground(disabledUnselected);
    expect(restingDisabledSelected).toBe(restingDisabledUnselected);

    await selected.hover();
    await expect(selected).toHaveAttribute('data-hovered', 'true');
    const hoveredSelected = await getBackground(selected);

    await unselected.hover();
    await expect(unselected).toHaveAttribute('data-hovered', 'true');
    const hoveredUnselected = await getBackground(unselected);
    expect(hoveredSelected).toBe(hoveredUnselected);

    // React Aria toggles a multiple-selection item on pointer down, so a
    // press cannot be canceled by moving the pointer away: it is the story's
    // pinned selection that keeps each row's state, not the cancel. The
    // selection is reasserted after each press to prove that.
    await selected.hover();
    await page.mouse.down();
    await expect(selected).toHaveAttribute('data-pressed', 'true');
    const pressedSelected = await getBackground(selected);
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await expect(selected).toHaveAttribute('data-selected', 'true');

    await unselected.hover();
    await page.mouse.down();
    await expect(unselected).toHaveAttribute('data-pressed', 'true');
    const pressedUnselected = await getBackground(unselected);
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await expect(unselected).not.toHaveAttribute('data-selected', 'true');
    expect(pressedSelected).toBe(pressedUnselected);

    // Focus stays indicated by the outline, not by a background: move the
    // keyboard focus away and back, so the item receives a visible focus.
    // The focused row is still the selected one, pinned by the story.
    await selected.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await expect(selected).toHaveAttribute('data-focus-visible', 'true');
    await expect(selected).toHaveAttribute('data-selected', 'true');

    const focusedSelected = await getBackground(selected);
    expect(focusedSelected).toBe(restingUnselected);

    const outline = await selected.evaluate((el) => {
      const { outlineColor, outlineStyle, outlineWidth } = getComputedStyle(
        el,
        '::before'
      );

      return { outlineColor, outlineStyle, outlineWidth };
    });

    const restingOutlineColor = await unselected.evaluate(
      (el) => getComputedStyle(el, '::before').outlineColor
    );

    // `getComputedStyle` serializes `transparent` as `rgba(0, 0, 0, 0)`, so
    // the resting outline color is pinned first: the focused color then has
    // to be a visible one, whatever format the theme color serializes to.
    expect(restingOutlineColor).toBe('rgba(0, 0, 0, 0)');
    expect(outline.outlineColor).not.toBe(restingOutlineColor);
    expect(outline.outlineStyle).not.toBe('none');
    expect(parseFloat(outline.outlineWidth)).toBeGreaterThan(0);
  });
});
