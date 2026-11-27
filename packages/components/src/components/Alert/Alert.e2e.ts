import { test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eExpectTokenColor,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('Alert', () => {
  test('status and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-alert--status-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-alert--status-and-style');
    await e2eExpectSurface(page.getByRole('alert').first(), '24px');
  });

  test('token parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-alert--status-and-style');
    const alert = page.getByRole('alert').filter({ hasText: 'warning' }).nth(1);

    await e2eExpectTokenColor(
      alert,
      'background-color',
      '--kbq-background-warning-less'
    );
  });
});
