'use client';

import type { ElementType } from 'react';
import { useRef } from 'react';

import { clsx, mergeProps, useHover, usePress } from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
import type { TreeState } from '@koobiq/react-primitives';
import { useMenuItem } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import type { ItemProps } from '../../../Collections';

const { listItem } = utilClasses;
const textVariant = utilClasses.typography;

export type MenuItemProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
};

export function MenuItem<T>({ item, state }: MenuItemProps<T>) {
  // Get props for the menu item element
  const ref = useRef(null);

  const {
    menuItemProps,
    isSelected: selected,
    isDisabled: disabled,
    isFocusVisible: focusVisible,
  } = useMenuItem({ key: item.key }, state, ref);

  const { hoverProps, isHovered: hovered } = useHover({ isDisabled: disabled });

  const { isPressed: pressed, pressProps } = usePress({ isDisabled: disabled });

  const Tag: ElementType = item.props.href ? 'a' : 'li';

  const {
    style,
    className,
    'data-testid': dataTestId,
  }: ItemProps<T> = item.props;

  return (
    <Tag
      {...mergeProps(menuItemProps, hoverProps, pressProps)}
      data-hovered={hovered}
      data-pressed={pressed}
      data-selected={selected}
      data-focus-visible={focusVisible}
      style={style}
      data-testid={dataTestId}
      className={clsx(listItem, textVariant['text-normal'], className)}
      ref={ref}
    >
      {item.rendered}
    </Tag>
  );
}
