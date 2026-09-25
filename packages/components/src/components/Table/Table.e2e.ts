import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Table', () => {
  test('state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-table--state');
    await e2eScreenshotThemes(page, '01');
  });
});
