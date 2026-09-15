'use client';

import type { ComponentPropsWithRef } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarBody.module.css';

export type NavbarBodyProps = ComponentPropsWithRef<'ul'>;

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
