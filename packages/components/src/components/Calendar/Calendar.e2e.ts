import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Calendar', () => {
  test('states', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-calendar--states');
    await e2eScreenshotThemes(page, '01');
  });
});
