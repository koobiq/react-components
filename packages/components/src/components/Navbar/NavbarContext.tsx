'use client';

import { createContext, useContext } from 'react';

export type NavbarContextProps = {
  isCollapsed?: boolean;
};

export const NavbarContext = createContext<NavbarContextProps>({});

export const useNavbarState = () => useContext(NavbarContext);
