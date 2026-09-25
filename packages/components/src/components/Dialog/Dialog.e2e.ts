import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Dialog', () => {
  test('base', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-dialog--base');
    await e2eScreenshotThemes(page, '01');
  });
});
