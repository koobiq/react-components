import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { e2eEnableDarkTheme, e2eGotoStory } from '../../../e2e/utils';

const getScreenshotTarget = (page: Page) =>
  page.getByTestId('e2eScreenshotTarget');

test.describe('Button', () => {
  test.describe('StateAndStyle', () => {
    test('with title', async ({ page }) => {
      await e2eGotoStory(page, 'e2e-button--state-and-style');

      await expect(getScreenshotTarget(page)).toHaveScreenshot('01-light.png');
      await e2eEnableDarkTheme(page);
      await expect(getScreenshotTarget(page)).toHaveScreenshot('01-dark.png');
    });

    test('with icon', async ({ page }) => {
      await e2eGotoStory(page, 'e2e-button--state-and-style-icon-only');

      await expect(getScreenshotTarget(page)).toHaveScreenshot('02-light.png');
      await e2eEnableDarkTheme(page);
      await expect(getScreenshotTarget(page)).toHaveScreenshot('02-dark.png');
    });

    test('with title, start and end icons', async ({ page }) => {
      await e2eGotoStory(page, 'e2e-button--state-and-style-with-icons');

      await expect(getScreenshotTarget(page)).toHaveScreenshot('03-light.png');
      await e2eEnableDarkTheme(page);
      await expect(getScreenshotTarget(page)).toHaveScreenshot('03-dark.png');
    });
  });
});
