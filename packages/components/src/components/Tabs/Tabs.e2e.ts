import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Tabs', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-tabs--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('focus visible on the first tab', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-tabs--focus-visible');
    await page.keyboard.press('Tab');
    await e2eScreenshotThemes(page, '02');
  });
});
