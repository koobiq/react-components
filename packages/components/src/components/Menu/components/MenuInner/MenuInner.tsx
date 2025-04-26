'use client';

import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useMenu, useTreeState } from '@koobiq/react-primitives';
import type { AriaMenuOptions } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
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

  return (
    <ul
      {...menuProps}
      className={clsx(s.base, list)}
      ref={ref}
      style={{ width: 120 }}
      {...(multiple && { 'aria-multiselectable': true })}
    >
      {[...state.collection].map((item) =>
        item.type === 'section' ? (
          <MenuSection key={item.key} section={item} state={state} />
        ) : (
          <MenuItem key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  );
}
