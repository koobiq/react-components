'use client';

import type { ComponentPropsWithRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../Navbar.module.css';

const { list } = utilClasses;

export type NavbarFooterProps = ComponentPropsWithRef<'footer'>;

export const NavbarFooter = ({
  children,
  className,
  ...props
}: NavbarFooterProps) => (
  <footer className={clsx(s.footer, className)} {...props}>
    <ul data-padded="true" className={clsx(list, s.list, className)}>
      {children}
    </ul>
  </footer>
);

NavbarFooter.displayName = 'NavbarFooter';
