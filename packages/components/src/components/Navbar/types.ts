import type { ComponentPropsWithRef } from 'react';

export const navbarPropVariant = ['vertical', 'horizontal'] as const;

export type NavbarPropVariant = (typeof navbarPropVariant)[number];

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
   * Navbar orientation variant.
   * @default 'vertical'
   */
  variant?: NavbarPropVariant;
  /**
   * Callback fired when collapse state changes.
   */
  onCollapse?: (isCollapsed: boolean) => void;
} & ComponentPropsWithRef<'nav'>;
