import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('TopBar', () => {
  test('shadow', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-topbar--shadow');
    await e2eScreenshotThemes(page, '01');
  });
});
