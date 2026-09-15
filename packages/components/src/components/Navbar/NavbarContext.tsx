'use client';

import { createContext, useContext } from 'react';

export type NavbarContextProps = {
  isCollapsed?: boolean;
  /** Whether the navbar has finished expanding, so items show at full width. */
  isExpanded?: boolean;
};

export const NavbarContext = createContext<NavbarContextProps>({});

export const useNavbarState = () => useContext(NavbarContext);
