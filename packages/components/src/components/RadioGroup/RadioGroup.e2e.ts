import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('RadioGroup', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-radiogroup--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('orientation', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-radiogroup--orientation');
    await e2eScreenshotThemes(page, '02');
  });
});
