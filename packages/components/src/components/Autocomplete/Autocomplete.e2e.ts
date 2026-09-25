import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Autocomplete', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-autocomplete--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-autocomplete--open');
    await page.getByRole('combobox').click();
    await e2eScreenshotThemes(page, '02');
  });
});
