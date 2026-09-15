'use client';

import { clsx } from '@koobiq/react-core';
import type { DataAttributeProps } from '@koobiq/react-core';

import { Divider } from '../../../Divider';

import s from './NavbarDivider.module.css';

export type NavbarDividerProps = {
  /** Additional CSS-classes. */
  className?: string;
} & DataAttributeProps;

export const NavbarDivider = ({ className, ...props }: NavbarDividerProps) => (
  // Hidden from assistive technology: a list may hold only list items.
  <li aria-hidden className={clsx(s.base, className)} {...props}>
    <Divider disablePaddings />
  </li>
);

NavbarDivider.displayName = 'NavbarDivider';
