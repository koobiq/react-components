import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../../e2e/utils';

test.describe('SideNavbar', () => {
  test('state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-sidenavbar--state');

    // The collapse button shows only while the navbar is hovered: it must stay
    // fully visible over the menu edge.
    await page.locator('nav').first().hover();

    await e2eScreenshotThemes(page, '01');
  });
});
