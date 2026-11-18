import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('SelectNext', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open');
    await e2eScreenshotThemes(page, '02');
  });

  test('open multiple', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open-multiple');
    await e2eScreenshotThemes(page, '03');
  });

  test('multiple option backgrounds', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open-multiple');

    const selected = page.getByTestId('selectnext-option-selected');
    const unselected = page.getByTestId('selectnext-option-unselected');

    const disabledSelected = page.getByTestId(
      'selectnext-option-disabled-selected'
    );

    const disabledUnselected = page.getByTestId(
      'selectnext-option-disabled-unselected'
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

    // Each press is canceled by moving the pointer away before releasing it,
    // so it never toggles the selection it is meant to observe.
    await selected.hover();
    await page.mouse.down();
    await expect(selected).toHaveAttribute('data-pressed', 'true');
    const pressedSelected = await getBackground(selected);
    await page.mouse.move(0, 0);
    await page.mouse.up();

    await unselected.hover();
    await page.mouse.down();
    await expect(unselected).toHaveAttribute('data-pressed', 'true');
    const pressedUnselected = await getBackground(unselected);
    await page.mouse.move(0, 0);
    await page.mouse.up();
    expect(pressedSelected).toBe(pressedUnselected);

    // Focus stays indicated by the outline, not by a background: move the
    // keyboard focus away and back, so the item receives a visible focus.
    await selected.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await expect(selected).toHaveAttribute('data-focus-visible', 'true');

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

    // The resting outline is transparent (serialized as `rgba(0, 0, 0, 0)`),
    // so comparing against it rejects an invisible outline without assuming
    // the focus theme color's serialization format.
    expect(outline.outlineColor).not.toBe(restingOutlineColor);
    expect(outline.outlineStyle).not.toBe('none');
    expect(parseFloat(outline.outlineWidth)).toBeGreaterThan(0);
  });
});
