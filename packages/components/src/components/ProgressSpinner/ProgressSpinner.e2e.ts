import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('ProgressSpinner', () => {
  test('size and value', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-progressspinner--size-and-value');
    await e2eScreenshotThemes(page, '01');
  });
});
