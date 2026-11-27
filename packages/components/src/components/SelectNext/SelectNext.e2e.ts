import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eExpectTokenColor,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

// The alpha of a computed color, whatever function it serializes as:
// `rgba()` keeps it behind the last comma, the wider-gamut functions
// (`oklch()`, `hsl()`, `color()`) behind a `/`, and no alpha part means
// opaque. A color can be invisible with nonzero channels — like
// `rgba(255, 0, 0, 0)` — so the alpha is parsed instead of comparing
// the string against `transparent`.
function getOutlineAlpha(color: string) {
  const rgba = /rgba\(.*,\s*([\d.]+)\s*\)$/.exec(color)?.[1];

  if (rgba !== undefined) return Number(rgba);

  const functional = /\/\s*([\d.]+)(%?)\s*\)$/.exec(color);

  if (!functional) return 1;

  const value = Number(functional[1]);

  return functional[2] ? value / 100 : value;
}

test.describe('SelectNext', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open');
    await e2eScreenshotThemes(page, '02');
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open');
    const panel = page.getByTestId('e2eScreenshotTarget');
    const option = page.getByRole('option').first();
    await option.hover();

    await e2eExpectSurface(panel, '14.8px');
    await e2eExpectSurface(option, '11.1px', '::before');
  });

  test('token parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open');
    const panel = page.getByTestId('e2eScreenshotTarget');
    const option = page.getByRole('option').first();
    await option.hover();

    await page.evaluate(() => {
      document.body.classList.remove('kbq-light');
      document.body.classList.add('kbq-dark');
    });

    await e2eExpectTokenColor(
      option,
      'background-color',
      '--kbq-states-background-transparent-hover',
      '::before'
    );

    await e2eExpectTokenColor(
      panel,
      'background-color',
      '--kbq-background-card'
    );
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

    // The outline has to be visible: the focused color's alpha is parsed —
    // a computed color can be invisible with nonzero channels, like
    // `rgba(255, 0, 0, 0)` — and the style and width have to draw it.
    expect(getOutlineAlpha(outline.outlineColor)).toBeGreaterThan(0);
    expect(outline.outlineStyle).not.toBe('none');
    expect(parseFloat(outline.outlineWidth)).toBeGreaterThan(0);
  });
});
