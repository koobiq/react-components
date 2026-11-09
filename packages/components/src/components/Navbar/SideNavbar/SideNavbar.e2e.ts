import { expect, test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../../e2e/utils';

test.describe('SideNavbar', () => {
  test('state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-sidenavbar--state');
    await e2eScreenshotThemes(page, '01');
  });

  test('the collapse button is not clipped by the menu edge', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-sidenavbar--state');

    const navbar = page.locator('nav').first();

    // The button shows only while the navbar is hovered.
    await navbar.hover();

    const button = navbar.getByRole('button', { name: 'Collapse' });

    await expect(button).toHaveCSS('opacity', '1');

    const buttonBox = await button.boundingBox();
    const navbarBox = await navbar.boundingBox();

    expect(buttonBox).not.toBeNull();
    expect(navbarBox).not.toBeNull();

    // The button straddles the menu edge: a clipping root would cut it in half.
    expect(buttonBox!.x + buttonBox!.width).toBeGreaterThan(
      navbarBox!.x + navbarBox!.width
    );

    await expect(navbar).toHaveCSS('overflow', 'visible');
  });
});
