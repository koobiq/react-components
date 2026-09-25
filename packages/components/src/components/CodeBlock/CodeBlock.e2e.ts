import { expect, test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('CodeBlock', () => {
  test('base', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-codeblock--base');
    // highlight.js is loaded after the first render.
    await expect(page.locator('.hljs-keyword').first()).toBeVisible();
    await e2eScreenshotThemes(page, '01');
  });
});
