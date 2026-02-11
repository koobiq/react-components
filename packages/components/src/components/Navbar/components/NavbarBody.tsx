'use client';

import type { ComponentPropsWithRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../Navbar.module.css';

const { list } = utilClasses;

export type NavbarBodyProps = ComponentPropsWithRef<'ul'>;

export const NavbarBody = ({
  children,
  className,
  ...props
}: NavbarBodyProps) => (
  <ul data-padded="true" className={clsx(list, s.list, className)} {...props}>
    {children}
  </ul>
);

NavbarBody.displayName = 'NavbarBody';
