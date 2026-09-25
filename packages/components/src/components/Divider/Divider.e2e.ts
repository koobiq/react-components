import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Divider', () => {
  test('orientation', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-divider--orientation');
    await e2eScreenshotThemes(page, '01');
  });
});
