import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Highlight', () => {
  test('variant', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-highlight--variant');
    await e2eScreenshotThemes(page, '01');
  });
});
