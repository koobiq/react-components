'use client';

import { type ElementType, useRef } from 'react';

import { clsx, mergeProps, useHover, usePress } from '@koobiq/react-core';
import { useOption } from '@koobiq/react-primitives';
import type { ListState, Node } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

export type ListOptionProps<T> = {
  item: Node<T>;
  state: ListState<T>;
};

export function ListOption<T>({ item, state }: ListOptionProps<T>) {
  const { href, className, style } = item.props;

  const ref = useRef(null);

  const {
    optionProps,
    isSelected: selected,
    isDisabled: disabled,
    isFocusVisible: focusVisible,
  } = useOption({ key: item.key }, state, ref);

  const { hoverProps, isHovered: hovered } = useHover({ isDisabled: disabled });

  const { isPressed: pressed, pressProps } = usePress({ isDisabled: disabled });

  const Tag: ElementType = href ? 'a' : 'li';

  return (
    <Tag
      {...mergeProps(optionProps, hoverProps, pressProps)}
      className={clsx(listItem, textVariant['text-normal'], className)}
      style={style}
      ref={ref}
      data-hovered={hovered}
      data-pressed={pressed}
      data-disabled={disabled}
      data-selected={selected}
      data-focus-visible={focusVisible}
    >
      {item.rendered}
    </Tag>
  );
}
