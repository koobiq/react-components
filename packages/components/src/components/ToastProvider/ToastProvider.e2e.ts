import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('ToastProvider', () => {
  test('status', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-toastprovider--status');
    await page.getByRole('button', { name: 'Show toasts' }).click();
    await e2eScreenshotThemes(page, '01', page.getByRole('region'));
  });
});
