'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarBody.module.css';

export type NavbarBodyProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The main items, e.g. `Navbar.Item`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'ul'>;

export const NavbarBody = ({
  children,
  className,
  ...props
}: NavbarBodyProps) => (
  <ul className={clsx(s.base, className)} {...props}>
    {children}
  </ul>
);

NavbarBody.displayName = 'NavbarBody';
