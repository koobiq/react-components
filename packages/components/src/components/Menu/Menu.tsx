'use client';

import type { Ref } from 'react';
import { forwardRef, useRef } from 'react';

import { useDOMRef, Pressable, mergeProps, clsx } from '@koobiq/react-core';
import { useMenuTriggerState, useMenuTrigger } from '@koobiq/react-primitives';

import { Divider, Item, Section, Header } from '../Collections';
import { ListItemText } from '../List';
import { PopoverInner } from '../Popover';
import type { PopoverInnerProps } from '../Popover';

import { MenuInner } from './components';
import type { MenuProps, MenuComponentProps, MenuRef } from './index';
import s from './Menu.module.css';

function MenuRender<T extends object>(
  props: Omit<MenuProps<T>, 'ref'>,
  ref: Ref<MenuRef>
) {
  const {
    placement = 'bottom start',
    'data-testid': testId,
    control,
    style,
    open,
    anchorRef,
    className,
    slotProps,
    ...otherProps
  } = props;

  const state = useMenuTriggerState({ ...props, isOpen: open });

  const domRef = useDOMRef<HTMLDivElement>(ref);

  const controlRef = useRef<HTMLButtonElement | null>(null);

  const { menuTriggerProps, menuProps } = useMenuTrigger<T>(
    {},
    state,
    controlRef
  );

  const popoverProps: PopoverInnerProps = mergeProps(
    {
      style,
      state,
      offset: 4,
      size: 'auto',
      hideArrow: true,
      popoverRef: domRef,
      'data-testid': testId,
      anchorRef: anchorRef || controlRef,
      className: clsx(s.popover, className),
    },
    slotProps?.popover
  );

  return (
    <>
      {control?.({
        ref: controlRef,
        ...menuTriggerProps,
      })}
      <PopoverInner type="menu" placement={placement} {...popoverProps}>
        <MenuInner {...otherProps} {...menuProps} />
      </PopoverInner>
    </>
  );
}

const MenuComponent = forwardRef(MenuRender) as MenuComponentProps;

type CompoundedComponent = typeof MenuComponent & {
  Item: typeof Item;
  Header: typeof Header;
  Section: typeof Section;
  Divider: typeof Divider;
  ItemText: typeof ListItemText;
  Control: typeof Pressable;
};

export const Menu = MenuComponent as CompoundedComponent;

Menu.Item = Item;
Menu.Section = Section;
Menu.Header = Header;
Menu.Divider = Divider;
Menu.ItemText = ListItemText;
Menu.Control = Pressable;
