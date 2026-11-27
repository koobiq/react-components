import { test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('Button', () => {
  test('with title', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-button--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-button--state-and-style');
    const firstButton = page.getByRole('button').first();

    await e2eExpectSurface(firstButton, '14.8px');
    await e2eExpectSurface(firstButton, '14.8px', '::before');
    await e2eExpectSurface(firstButton, '14.8px', '::after');

    const loadingButton = page
      .getByRole('button')
      .filter({ has: page.locator('[class*="loader"]') })
      .first();

    await e2eExpectSurface(loadingButton, '14.8px');

    await e2eExpectSurface(
      loadingButton.locator('[class*="loader"]'),
      '14.8px'
    );
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
