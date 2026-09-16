'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarBody.module.css';

export type NavbarBodyProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The main items, e.g. `SideNavbar.Item`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'div'>;

export const NavbarBody = ({
  children,
  className,
  ...props
}: NavbarBodyProps) => (
  <div className={clsx(s.base, className)} {...props}>
    {children}
  </div>
);

NavbarBody.displayName = 'NavbarBody';
