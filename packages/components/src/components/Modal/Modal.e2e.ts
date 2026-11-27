import { test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eExpectTokenColor,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('Modal', () => {
  test('open', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-modal--open');
    await e2eScreenshotThemes(page, '01');
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-modal--open');
    await e2eExpectSurface(page.getByTestId('e2eScreenshotTarget'), '24px');
  });

  test('token parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-modal--open');

    await e2eExpectTokenColor(
      page.getByTestId('e2eScreenshotTarget'),
      'background-color',
      '--kbq-background-card'
    );
  });
});
