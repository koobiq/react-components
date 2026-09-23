import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('SelectNext', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-selectnext--open');
    await e2eScreenshotThemes(page, '02');
  });
});
