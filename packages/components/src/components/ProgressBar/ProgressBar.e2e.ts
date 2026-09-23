import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('ProgressBar', () => {
  test('value', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-progressbar--value');
    await e2eScreenshotThemes(page, '01');
  });
});
