'use client';

import { type ElementType, useRef } from 'react';

import { clsx, mergeProps, useHover, usePress } from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
import { useOption } from '@koobiq/react-primitives';
import type { ListState } from '@koobiq/react-primitives';

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

  const { optionProps, isSelected, isDisabled, isFocusVisible } = useOption(
    { key: item.key },
    state,
    ref
  );

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { isPressed, pressProps } = usePress({ isDisabled });

  const Tag: ElementType = href ? 'a' : 'li';

  return (
    <Tag
      {...mergeProps(optionProps, hoverProps, pressProps)}
      className={clsx(listItem, textVariant['text-normal'], className)}
      style={style}
      ref={ref}
      data-hovered={isHovered}
      data-pressed={isPressed}
      data-disabled={isDisabled}
      data-selected={isSelected}
      data-focus-visible={isFocusVisible}
    >
      {item.rendered}
    </Tag>
  );
}
