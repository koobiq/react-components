import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('List', () => {
  test('state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-list--state');
    await e2eScreenshotThemes(page, '01');
  });
});
