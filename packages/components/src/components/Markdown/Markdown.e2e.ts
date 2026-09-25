import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Markdown', () => {
  test('elements', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-markdown--elements');
    await e2eScreenshotThemes(page, '01');
  });
});
