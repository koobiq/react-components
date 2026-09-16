'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarFooter.module.css';

export type NavbarFooterProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The footer items, e.g. the user `SideNavbar.Item`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'footer'>;

export const NavbarFooter = forwardRef<HTMLElement, NavbarFooterProps>(
  ({ children, className, ...props }, ref) => (
    <footer className={clsx(s.base, className)} {...props} ref={ref}>
      {children}
    </footer>
  )
);

NavbarFooter.displayName = 'NavbarFooter';
