'use client';

import { clsx, type DistributiveOmit } from '@koobiq/react-core';

import s from '../Navbar.module.css';

import { NavbarItem, type NavbarItemProps } from './NavbarItem';

export type NavbarAppItemProps = DistributiveOmit<
  NavbarItemProps,
  'isMenu' | 'badge'
>;

export const NavbarAppItem = ({ className, ...props }: NavbarAppItemProps) => (
  <NavbarItem {...props} className={clsx(s.appItem, className)} />
);

NavbarAppItem.displayName = 'NavbarAppItem';
