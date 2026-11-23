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
