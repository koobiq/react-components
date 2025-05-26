'use client';

import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useMenu, useTreeState } from '@koobiq/react-primitives';
import type { AriaMenuOptions } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Divider } from '../../../Divider';
import { MenuHeader } from '../MenuHeader';
import { MenuItem } from '../MenuItem';
import { MenuSection } from '../MenuSection';

import s from './MenuInner.module.css';

export type MenuInnerProps<T> = AriaMenuOptions<T>;

const { list } = utilClasses;

export function MenuInner<T extends object>(props: MenuInnerProps<T>) {
  // Create menu state based on the incoming props
  const state = useTreeState(props);

  // Get props for the menu element
  const ref = useRef(null);
  const { menuProps } = useMenu(props, state, ref);

  const multiple = props.selectionMode === 'multiple';

  const renderItems = (treeState: typeof state) =>
    [...treeState.collection].map((item) => {
      switch (item.type) {
        case 'header':
          return <MenuHeader key={item.key} item={item} />;

        case 'divider':
          return <Divider key={item.key} className={s.divider} />;

        case 'item':
          return <MenuItem key={item.key} item={item} state={state} />;

        case 'section':
          return <MenuSection key={item.key} section={item} state={state} />;

        default:
          return null;
      }
    });

  return (
    <ul
      {...menuProps}
      className={clsx(s.base, list)}
      {...(multiple && { 'aria-multiselectable': true })}
      ref={ref}
    >
      {renderItems(state)}
    </ul>
  );
}
