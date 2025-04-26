'use client';

import type { Ref } from 'react';
import { forwardRef, useRef } from 'react';

import { useDOMRef } from '@koobiq/react-core';
import { useMenuTriggerState, useMenuTrigger } from '@koobiq/react-primitives';

import { PopoverInner } from '../Popover';
import type { PopoverInnerProps } from '../Popover';

import { MenuInner } from './components';
import type { MenuProps, MenuComponent, MenuRef } from './index';
import s from './Menu.module.css';

function MenuRender<T extends object>(
  props: Omit<MenuProps<T>, 'ref'>,
  ref: Ref<MenuRef>
) {
  const { control } = props;
  const state = useMenuTriggerState(props);

  const domRef = useDOMRef<HTMLDivElement>(ref);

  const controlRef = useRef<HTMLButtonElement | null>(null);

  const { menuTriggerProps, menuProps } = useMenuTrigger<T>(
    {},
    state,
    controlRef
  );

  const { isDisabled, onPress, ...otherMenuTriggerProps } = menuTriggerProps;

  const popoverProps: PopoverInnerProps = {
    state,
    offset: 4,
    size: 'auto',
    hideArrow: true,
    popoverRef: domRef,
    anchorRef: controlRef,
  };

  return (
    <>
      {control?.({
        ref: controlRef,
        onClick: onPress,
        disabled: isDisabled,
        ...otherMenuTriggerProps,
      })}
      <PopoverInner
        type="menu"
        placement="bottom start"
        className={s.popover}
        {...popoverProps}
      >
        <MenuInner {...props} {...menuProps} />
      </PopoverInner>
    </>
  );
}

export const Menu = forwardRef(MenuRender) as MenuComponent;
