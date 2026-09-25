import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('SidePanel', () => {
  // The panel is as tall as the page, so a short viewport keeps the screenshot small.
  test.use({ viewport: { width: 600, height: 280 } });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-sidepanel--open');
    await e2eScreenshotThemes(page, '01');
  });
});
