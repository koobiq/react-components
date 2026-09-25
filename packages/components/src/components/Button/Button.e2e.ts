import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Button', () => {
  test('with title', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-button--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('with icon', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-button--state-and-style-icon-only');
    await e2eScreenshotThemes(page, '02');
  });

  test('with title, start and end icons', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-button--state-and-style-with-icons');
    await e2eScreenshotThemes(page, '03');
  });
});
