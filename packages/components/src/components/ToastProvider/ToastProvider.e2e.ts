import { expect, test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('ToastProvider', () => {
  test('status', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-toastprovider--status');
    await page.getByRole('button', { name: 'Show toasts' }).click();
    await e2eScreenshotThemes(page, '01', page.getByRole('region'));
  });

  test('close alignment parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-toastprovider--status');
    await page.getByRole('button', { name: 'Show toasts' }).click();

    const closeButton = page.getByRole('region').getByRole('button').first();
    await expect(closeButton).toHaveCSS('margin-top', '14px');
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-toastprovider--status');
    await page.getByRole('button', { name: 'Show toasts' }).click();

    await e2eExpectSurface(
      page.getByRole('alert').first().locator('..'),
      '14.8px'
    );
  });
});
