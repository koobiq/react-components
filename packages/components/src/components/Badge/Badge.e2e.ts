import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Badge', () => {
  test('variant', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-badge--variant');
    await e2eScreenshotThemes(page, '01');
  });
});
