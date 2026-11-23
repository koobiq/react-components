import { expect, test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('InlineEdit', () => {
  test('view states', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--view-states');
    await e2eScreenshotThemes(page, '01');
  });

  test('edit state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--edit-state');
    await e2eScreenshotThemes(page, '02');
  });

  test('edit state without label', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--edit-state-without-label');
    await e2eScreenshotThemes(page, '03');
  });

  test('matches the editor geometry', async ({ page }) => {
    for (const [story, anchorSelector] of [
      [
        'e2e-inlineedit--edit-state',
        '[data-slot="inline-edit-view-container"]',
      ],
      ['e2e-inlineedit--edit-state-without-label', '[data-slot="inline-edit"]'],
    ] as const) {
      await e2eGotoStory(page, story);

      const panel = page.locator('[data-slot="inline-edit-panel"]');
      const input = page.getByRole('textbox', { name: 'Value' });
      await expect(panel).toBeVisible();
      await expect(input).toBeFocused();

      const [panelBox, anchorBox, inputBox] = await Promise.all([
        panel.boundingBox(),
        page.locator(anchorSelector).boundingBox(),
        input.boundingBox(),
      ]);

      expect(panelBox).not.toBeNull();
      expect(anchorBox).not.toBeNull();
      expect(inputBox).not.toBeNull();

      expect(panelBox!.x).toBeCloseTo(anchorBox!.x, 5);
      expect(panelBox!.y).toBeCloseTo(anchorBox!.y, 5);
      expect(panelBox!.width).toBeCloseTo(anchorBox!.width, 5);
      expect(panelBox!.height).toBeCloseTo(inputBox!.height, 5);
    }
  });

  test('does not clip the editor focus ring', async ({ page }) => {
    for (const story of [
      'e2e-inlineedit--edit-state',
      'e2e-inlineedit--edit-state-without-label',
    ]) {
      await e2eGotoStory(page, story);

      const input = page.getByRole('textbox', { name: 'Value' });
      await expect(input).toBeFocused();

      const clippingAncestors = await input.evaluate((element) => {
        const panelElement = document.querySelector(
          '[data-slot="inline-edit-panel"]'
        );

        const result: string[] = [];

        for (
          let current = element.parentElement;
          current && current !== panelElement;
          current = current.parentElement
        ) {
          const style = getComputedStyle(current);

          if (
            style.overflow !== 'visible' ||
            style.overflowX !== 'visible' ||
            style.overflowY !== 'visible'
          ) {
            result.push(
              `${current.getAttribute('data-slot') || current.tagName}: ${style.overflow}`
            );
          }
        }

        return result;
      });

      expect(clippingAncestors).toEqual([]);
    }
  });

  test('closes on outside interaction without reopening or stealing focus', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--outside-interaction');

    const outsideButton = page.getByTestId('outside-button');
    const outsideNonfocusable = page.getByTestId('outside-nonfocusable');
    const saveCount = page.getByTestId('save-count');
    let expectedSaveCount = 0;

    for (const testId of ['controlled', 'uncontrolled']) {
      const root = page.getByTestId(testId);
      const view = root.getByRole('button');

      await view.click();
      await expect(page.getByRole('textbox', { name: 'Value' })).toBeFocused();

      await outsideButton.click();
      expectedSaveCount += 1;

      await expect(root).toHaveAttribute('data-mode', 'view');
      await expect(outsideButton).toBeFocused();
      await expect(saveCount).toHaveText(String(expectedSaveCount));
      await expect(page.getByRole('dialog')).toHaveCount(0);

      await view.click();
      await outsideNonfocusable.click();
      expectedSaveCount += 1;

      await expect(root).toHaveAttribute('data-mode', 'view');
      await expect(saveCount).toHaveText(String(expectedSaveCount));
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(view).toBeFocused();

      await outsideButton.click();
      await expect(saveCount).toHaveText(String(expectedSaveCount));
      await expect(outsideButton).toBeFocused();
    }
  });

  test('saves a real Textarea with Cmd/Ctrl+Enter', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--textarea-interaction');

    const textarea = page.getByRole('textbox', { name: 'Value' });
    await expect(textarea).toBeFocused();

    await textarea.fill('Line 1');
    await textarea.press('Enter');
    await textarea.pressSequentially('Line 2');
    await expect(textarea).toHaveValue('Line 1\nLine 2');

    await textarea.press('Control+Enter');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('saved-value')).toHaveText('Line 1\nLine 2');
  });

  test('resolves the default and root-level panel shadow', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--edit-state');

    const defaultPanel = page.locator('[data-slot="inline-edit-panel"]');
    await expect(defaultPanel).toBeVisible();

    const defaultShadow = await defaultPanel.evaluate(
      (element) => getComputedStyle(element).boxShadow
    );

    expect(defaultShadow).not.toBe('none');

    await e2eGotoStory(page, 'e2e-inlineedit--view-states');
    const root = page.locator('[data-slot="inline-edit"]').first();

    await root.evaluate((element) => {
      element.style.setProperty(
        '--kbq-inline-edit-panel-shadow',
        '0 4px 8px rgb(1, 2, 3)'
      );
    });

    await root.getByRole('button', { name: 'Edit' }).click();

    const overriddenPanel = page.locator('[data-slot="inline-edit-panel"]');
    await expect(overriddenPanel).toBeVisible();

    await expect
      .poll(() =>
        overriddenPanel.evaluate(
          (element) => getComputedStyle(element).boxShadow
        )
      )
      .toContain('rgb(1, 2, 3)');
  });
});
