import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('DescriptionList', () => {
  test('orientation', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-descriptionlist--orientation');
    await e2eScreenshotThemes(page, '01');
  });
});
