import { expect, test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('Tabs', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-tabs--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });

  test('focus visible on the first tab', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-tabs--focus-visible');
    await page.keyboard.press('Tab');
    await e2eScreenshotThemes(page, '02');
  });

  test('focus visible on the first tab when scrollable', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-tabs--focus-visible-scrollable');
    await page.keyboard.press('Tab');
    await e2eScreenshotThemes(page, '03');
  });

  test('vertical scroll mask', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-tabs--vertical-scroll-mask');

    const scrollBox = (edge: string) =>
      page
        .getByTestId(`e2eTabsScrollMask-${edge}`)
        .locator('[role="tablist"]')
        .locator('..');

    const scrollTo = (edge: string, position: 'middle' | 'end') =>
      scrollBox(edge).evaluate((el, to) => {
        const max = el.scrollHeight - el.clientHeight;

        el.scrollTop = to === 'end' ? max : Math.round(max / 2);
      }, position);

    await scrollTo('both', 'middle');
    await scrollTo('start', 'end');

    await expect(scrollBox('end')).not.toHaveAttribute(
      'data-overflow-block-start'
    );

    await expect(scrollBox('end')).toHaveAttribute('data-overflow-block-end');

    await expect(scrollBox('both')).toHaveAttribute(
      'data-overflow-block-start'
    );

    await expect(scrollBox('both')).toHaveAttribute('data-overflow-block-end');

    await expect(scrollBox('start')).toHaveAttribute(
      'data-overflow-block-start'
    );

    await expect(scrollBox('start')).not.toHaveAttribute(
      'data-overflow-block-end'
    );

    await e2eScreenshotThemes(page, '04');
  });
});
