'use client';

import type { Ref } from 'react';
import { forwardRef, useRef } from 'react';

import { useDOMRef, Pressable } from '@koobiq/react-core';
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
  const { control, open, anchorRef, placement = 'bottom start' } = props;
  const state = useMenuTriggerState({ ...props, isOpen: open });

  const domRef = useDOMRef<HTMLDivElement>(ref);

  const controlRef = useRef<HTMLButtonElement | null>(null);

  const { menuTriggerProps, menuProps } = useMenuTrigger<T>(
    {},
    state,
    controlRef
  );

  const { isDisabled, ...otherMenuTriggerProps } = menuTriggerProps;

  const popoverProps: PopoverInnerProps = {
    state,
    offset: 4,
    size: 'auto',
    hideArrow: true,
    popoverRef: domRef,
    anchorRef: anchorRef || controlRef,
  };

  return (
    <>
      {control?.({
        ref: controlRef,
        disabled: isDisabled,
        ...otherMenuTriggerProps,
      })}
      <PopoverInner
        type="menu"
        placement={placement}
        className={s.popover}
        {...popoverProps}
      >
        <MenuInner {...props} {...menuProps} />
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
