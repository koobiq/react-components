import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Flag', () => {
  test('shape', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-flag--shape');
    await e2eScreenshotThemes(page, '01');
  });
});
