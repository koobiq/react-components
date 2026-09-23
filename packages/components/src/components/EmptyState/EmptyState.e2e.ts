import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('EmptyState', () => {
  test('size', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-emptystate--size');
    await e2eScreenshotThemes(page, '01');
  });
});
