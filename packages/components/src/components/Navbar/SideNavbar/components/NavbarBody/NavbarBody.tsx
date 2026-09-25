'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarBody.module.css';

export type NavbarBodyProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The main items, e.g. `SideNavbar.Item`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'div'>;

export const NavbarBody = forwardRef<HTMLDivElement, NavbarBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div className={clsx(s.base, className)} {...props} ref={ref}>
      {children}
    </div>
  )
);

NavbarBody.displayName = 'NavbarBody';
