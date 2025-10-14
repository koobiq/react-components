'use client';

import { type ElementType, useRef } from 'react';

import { clsx, mergeProps, useHover, usePress } from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
import { useOption } from '@koobiq/react-primitives';
import type { ListState } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import type { ItemProps } from '../../../Collections';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

export type ListOptionProps<T> = {
  item: Node<T>;
  state: ListState<T>;
};

export function ListOption<T>({ item, state }: ListOptionProps<T>) {
  const {
    href,
    style,
    className,
    'data-testid': dataTestId,
  }: ItemProps<T> = item.props;

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
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-testid={dataTestId}
    >
      {item.rendered}
    </Tag>
  );
}
