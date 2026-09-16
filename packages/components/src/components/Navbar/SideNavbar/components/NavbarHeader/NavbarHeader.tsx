'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarHeader.module.css';

export type NavbarHeaderProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The header items, e.g. `SideNavbar.AppItem`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'header'>;

export const NavbarHeader = ({
  className,
  children,
  ...props
}: NavbarHeaderProps) => (
  <header className={clsx(s.base, className)} {...props}>
    {children}
  </header>
);

NavbarHeader.displayName = 'NavbarHeader';
