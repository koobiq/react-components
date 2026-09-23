import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('TreeSelect', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-treeselect--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-treeselect--open');
    await e2eScreenshotThemes(page, '02');
  });
});
