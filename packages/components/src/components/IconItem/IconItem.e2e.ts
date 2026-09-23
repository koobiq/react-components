import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('IconItem', () => {
  test('variant', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-iconitem--variant');
    await e2eScreenshotThemes(page, '01');
  });
});
