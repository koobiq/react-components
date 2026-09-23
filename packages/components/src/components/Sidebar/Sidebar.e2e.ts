import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Sidebar', () => {
  test('state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-sidebar--state');
    await e2eScreenshotThemes(page, '01');
  });
});
