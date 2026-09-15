'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarFooter.module.css';

export type NavbarFooterProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The footer items, e.g. the user `Navbar.Item`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'footer'>;

export const NavbarFooter = ({
  children,
  className,
  ...props
}: NavbarFooterProps) => (
  <footer className={clsx(s.base, className)} {...props}>
    <ul className={clsx(s.list, className)}>{children}</ul>
  </footer>
);

NavbarFooter.displayName = 'NavbarFooter';
