'use client';

import { clsx, type DistributiveOmit } from '@koobiq/react-core';

import { NavbarItem, type NavbarItemProps } from '../NavbarItem';

import s from './NavbarAppItem.module.css';

export type NavbarAppItemProps = DistributiveOmit<
  NavbarItemProps,
  'isMenu' | 'badge'
>;

export const NavbarAppItem = ({ className, ...props }: NavbarAppItemProps) => (
  <NavbarItem {...props} isMenu={false} className={clsx(s.base, className)} />
);

NavbarAppItem.displayName = 'NavbarAppItem';
