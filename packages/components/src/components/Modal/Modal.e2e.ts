import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Modal', () => {
  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-modal--open');
    await e2eScreenshotThemes(page, '01');
  });
});
