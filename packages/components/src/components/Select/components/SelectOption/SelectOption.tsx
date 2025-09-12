'use client';

import { type ElementType, useRef } from 'react';

import { clsx, mergeProps, useHover, usePress } from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
import { type MultiSelectState, useOption } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Checkbox } from '../../../Checkbox';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

export type SelectOptionProps<T> = {
  item: Node<T>;
  state: MultiSelectState<T>;
};

export function SelectOption<T>({ item, state }: SelectOptionProps<T>) {
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
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {state.selectionMode === 'multiple' && (
        <Checkbox isDisabled={isDisabled} isSelected={isSelected} isReadOnly />
      )}
      {item.rendered}
    </Tag>
  );
}
