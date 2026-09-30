import type { ComponentPropsWithRef } from 'react';

/**
 * @deprecated Use `SideNavbar` or `TopNavbar` instead.
 */
export const navbarPropVariant = ['vertical', 'horizontal'] as const;

/**
 * @deprecated Use `SideNavbarProps` or `TopNavbarProps` instead.
 */
export type NavbarPropVariant = (typeof navbarPropVariant)[number];

/**
 * @deprecated Use `SideNavbarProps` or `TopNavbarProps` instead.
 */
export type NavbarProps = {
  /**
   * Whether the navbar is collapsed.
   */
  isCollapsed?: boolean;
  /**
   * Whether the toggle button is hidden.
   */
  isToggleButtonHidden?: boolean;
  /**
   * Default collapsed state when uncontrolled.
   */
  defaultCollapsed?: boolean;
  /**
   * This prop is ignored. Use `SideNavbar` for a vertical menu or `TopNavbar`
   * for a horizontal menu.
   * @deprecated Use `SideNavbar` or `TopNavbar` instead.
   * @default 'vertical'
   */
  variant?: NavbarPropVariant;
  /**
   * Callback fired when collapse state changes.
   */
  onCollapse?: (isCollapsed: boolean) => void;
} & ComponentPropsWithRef<'nav'>;
