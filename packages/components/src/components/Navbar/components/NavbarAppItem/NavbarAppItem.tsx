'use client';

import { useLayoutEffect, useState } from 'react';

import {
  clsx,
  useResizeObserver,
  type DistributiveOmit,
} from '@koobiq/react-core';

import { useNavbarState } from '../NavbarContext';
import { NavbarItem, type NavbarItemProps } from '../NavbarItem';

import s from './NavbarAppItem.module.css';

export type NavbarAppItemProps = DistributiveOmit<
  NavbarItemProps,
  'isMenu' | 'badge'
>;

export const NavbarAppItem = ({ className, ...props }: NavbarAppItemProps) => {
  const { isExpanded } = useNavbarState();
  const [ref] = useResizeObserver<HTMLAnchorElement>();
  const [isLongTitle, setLongTitle] = useState(false);

  // A name that does not fit into one line switches to two smaller lines.
  // It is measured in one line and only at full width, as in Koobiq Angular.
  useLayoutEffect(() => {
    const item = ref.current;

    const title = item?.querySelector<HTMLElement>(
      '[data-slot="navbar-item-content"]'
    );

    if (!isExpanded || !item || !title) return;

    const value = item.getAttribute('data-long-title');

    item.removeAttribute('data-long-title');
    setLongTitle(title.scrollWidth > title.clientWidth);
    if (value !== null) item.setAttribute('data-long-title', value);
  });

  return (
    <NavbarItem
      {...props}
      ref={ref}
      isMenu={false}
      data-slot="navbar-app-item"
      data-long-title={isLongTitle || undefined}
      className={clsx(s.base, className)}
    />
  );
};

NavbarAppItem.displayName = 'NavbarAppItem';
