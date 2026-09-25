import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('ClampedText', () => {
  test('collapsed and expanded', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-clampedtext--collapsed-and-expanded');
    await e2eScreenshotThemes(page, '01');
  });
});
