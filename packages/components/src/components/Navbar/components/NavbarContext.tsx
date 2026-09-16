'use client';

import { createContext, useContext } from 'react';

export type NavbarPropOrientation = 'vertical' | 'horizontal';

export type NavbarContextProps = {
  /** The direction the navbar items run in. */
  orientation: NavbarPropOrientation;
  isCollapsed?: boolean;
  /** Whether the navbar has finished expanding, so items show at full width. */
  isExpanded?: boolean;
};

export const NavbarContext = createContext<NavbarContextProps>({
  orientation: 'vertical',
});

export const useNavbarState = () => useContext(NavbarContext);
