import { expect, test } from '@playwright/test';

import {
  e2eExpectSurface,
  e2eGotoStory,
  e2eScreenshotThemes,
} from '../../../e2e/utils';

test.describe('Input', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-input--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('surface parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-input--state-and-style');

    await e2eExpectSurface(
      page.getByLabel('focus', { exact: true }).first().locator('..'),
      '14.8px'
    );
  });

  test('focus parity', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-input--state-and-style');

    const group = page
      .getByLabel('focus', { exact: true })
      .first()
      .locator('..');

    const outline = await group.evaluate((element) => {
      const style = getComputedStyle(element, '::after');

      return { width: style.outlineWidth, offset: style.outlineOffset };
    });

    expect(outline).toEqual({ width: '2px', offset: '-2px' });
  });
});
