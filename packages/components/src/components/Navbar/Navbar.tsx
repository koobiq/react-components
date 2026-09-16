'use client';

import { forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';

import {
  NavbarAction,
  NavbarAppItem,
  NavbarDivider,
  NavbarItem,
} from './components';
import { SideNavbar, type SideNavbarProps } from './SideNavbar';
import type { NavbarProps } from './types';

/**
 * @deprecated Use `SideNavbar` or `TopNavbar` instead.
 */
export const NavbarComponent = forwardRef<HTMLElement, NavbarProps>(
  (props, ref) => {
    if (process.env.NODE_ENV !== 'production' && 'variant' in props) {
      deprecate(
        'Navbar: the "variant" prop is deprecated and ignored. Use SideNavbar or TopNavbar instead.'
      );
    }

    const sideNavbarProps = { ...props };
    delete sideNavbarProps.variant;

    return <SideNavbar {...(sideNavbarProps as SideNavbarProps)} ref={ref} />;
  }
);

NavbarComponent.displayName = 'Navbar';

/**
 * @deprecated Use `SideNavbar` or `TopNavbar` instead.
 */
export const Navbar = Object.assign(NavbarComponent, {
  Header: SideNavbar.Header,
  Body: SideNavbar.Body,
  Footer: SideNavbar.Footer,
  Item: NavbarItem,
  AppItem: NavbarAppItem,
  Divider: NavbarDivider,
  Action: NavbarAction,
});
