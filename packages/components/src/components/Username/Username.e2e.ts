import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Username', () => {
  test('mode and type', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-username--mode-and-type');
    await e2eScreenshotThemes(page, '01');
  });
});
