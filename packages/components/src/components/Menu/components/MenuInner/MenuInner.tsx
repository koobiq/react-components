'use client';

import type { ComponentRef, Ref, ReactElement } from 'react';
import { forwardRef } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
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

export type MenuInnerComponent = <T>(
  props: MenuInnerProps<T>
) => ReactElement | null;

export type MenuInnerRef = ComponentRef<'ul'>;

function MenuInnerRender<T extends object = object>(
  props: MenuInnerProps<T>,
  ref: Ref<MenuInnerRef>
) {
  // Create menu state based on the incoming props
  const state = useTreeState(props);

  const domRef = useDOMRef(ref);
  const { menuProps } = useMenu(props, state, domRef);

  const multiple = props.selectionMode === 'multiple';

  const renderItems = (treeState: typeof state) =>
    [...treeState.collection].map((item) => {
      switch (item.type) {
        case 'header':
          return <MenuHeader key={item.key} item={item} />;

        case 'divider':
          return <Divider key={item.key} />;

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
      data-padded={true}
      className={clsx(s.base, list)}
      {...(multiple && { 'aria-multiselectable': true })}
      ref={domRef}
    >
      {renderItems(state)}
    </ul>
  );
}

export const MenuInner = forwardRef(MenuInnerRender) as MenuInnerComponent;
