'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import s from './NavbarHeader.module.css';

export type NavbarHeaderProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The header items, e.g. `Navbar.AppItem`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'header'>;

export const NavbarHeader = ({
  className,
  children,
  ...props
}: NavbarHeaderProps) => (
  <header className={className} {...props}>
    <ul className={s.list}>{children}</ul>
  </header>
);

NavbarHeader.displayName = 'NavbarHeader';
