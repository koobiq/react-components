'use client';

import type { ComponentPropsWithRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../Navbar.module.css';

const { list } = utilClasses;

export type NavbarHeaderProps = ComponentPropsWithRef<'header'>;

export const NavbarHeader = ({
  className,
  children,
  ...props
}: NavbarHeaderProps) => (
  <header className={clsx(s.header, className)} {...props}>
    <ul data-padded="true" className={clsx(list, s.list, className)}>
      {children}
    </ul>
  </header>
);

NavbarHeader.displayName = 'NavbarHeader';
