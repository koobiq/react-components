import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('DatePicker', () => {
  test('states', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-datepicker--states');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-datepicker--open');
    await e2eScreenshotThemes(page, '02');
  });
});
