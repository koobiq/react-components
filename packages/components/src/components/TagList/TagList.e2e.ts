import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('TagList', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-taglist--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });
});
