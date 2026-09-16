import type { ComponentPropsWithRef } from 'react';

export type SideNavbarProps = {
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
   * Callback fired when collapse state changes.
   */
  onCollapse?: (isCollapsed: boolean) => void;
} & ComponentPropsWithRef<'nav'>;
