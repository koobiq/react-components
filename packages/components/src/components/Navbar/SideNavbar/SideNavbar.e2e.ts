import { expect, test } from '@playwright/test';

import { e2eGotoStory } from '../../../../e2e/utils';

test.describe('SideNavbar', () => {
  test('overrides the composed Sidebar and NavbarItem rules', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-sidenavbar--state');

    const navbar = page.locator('nav').first();

    // The toggle button overflows the menu edge, so the root must not clip it.
    await expect(navbar).toHaveCSS('overflow', 'visible');

    // The generic vertical item rules (block-size: 40px, padding: 0 12px,
    // border-width: 0) must not win over the AppItem overrides.
    const appItem = navbar.getByRole('link', { name: 'App name' });

    await expect(appItem).not.toHaveCSS('height', '40px');
    await expect(appItem).not.toHaveCSS('padding-top', '0px');
    await expect(appItem).not.toHaveCSS('padding-bottom', '0px');
    await expect(appItem).not.toHaveCSS('border-top-width', '0px');
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
  });
});
