'use client';

import type { ComponentPropsWithRef } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './NavbarHeader.module.css';

export type NavbarHeaderProps = ComponentPropsWithRef<'header'>;

export const NavbarHeader = ({
  className,
  children,
  ...props
}: NavbarHeaderProps) => (
  <header className={className} {...props}>
    <ul className={clsx(s.list, className)}>{children}</ul>
  </header>
);

NavbarHeader.displayName = 'NavbarHeader';
