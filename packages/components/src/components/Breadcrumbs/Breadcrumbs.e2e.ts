import { expect, test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('Breadcrumbs', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-breadcrumbs--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('current typography parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-breadcrumbs--state-and-style');

    await expect(page.locator('[data-current="true"]').first()).toHaveCSS(
      'font-weight',
      '400'
    );
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-breadcrumbs--state-and-style');

    await e2eExpectSurface(
      page.locator('[data-current="true"]').first(),
      '11.1px'
    );
  });
});
