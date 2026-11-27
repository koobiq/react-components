import { test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eExpectTokenColor,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('Select', () => {
  test('open screenshot', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-select--open');

    await e2eScreenshotThemes(
      page,
      '01',
      page.getByTestId('e2eScreenshotTarget')
    );
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-select--open');
    const panel = page.getByTestId('e2eScreenshotTarget');
    const option = page.getByRole('option').first();
    await option.hover();

    await e2eExpectSurface(panel, '14.8px');
    await e2eExpectSurface(option, '11.1px', '::before');
  });

  test('token parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-select--open');
    const panel = page.getByTestId('e2eScreenshotTarget');
    const option = page.getByRole('option').first();
    await option.hover();

    await page.evaluate(() => {
      document.body.classList.remove('kbq-light');
      document.body.classList.add('kbq-dark');
    });

    await e2eExpectTokenColor(
      option,
      'background-color',
      '--kbq-states-background-transparent-hover',
      '::before'
    );

    await e2eExpectTokenColor(
      panel,
      'background-color',
      '--kbq-background-card'
    );
  });
});
