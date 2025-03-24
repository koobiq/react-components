'use client';

import { type ElementType, useRef } from 'react';

import { clsx, mergeProps, useHover, usePress } from '@koobiq/react-core';
import { useOption } from '@koobiq/react-primitives';
import type { ListState, Node } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

import s from './ListOption.module.css';

const textVariant = utilClasses.typography;

export function ListOption<T>({
  item,
  state,
}: {
  item: Node<T>;
  state: ListState<T>;
}) {
  const ref = useRef(null);

  const {
    optionProps,
    isSelected: selected,
    isDisabled: disabled,
    isFocusVisible: focusVisible,
  } = useOption({ key: item.key }, state, ref);

  const { hoverProps, isHovered: hovered } = useHover({ isDisabled: disabled });

  const { isPressed: pressed, pressProps } = usePress({ isDisabled: disabled });

  const Tag: ElementType = item.props.href ? 'a' : 'li';

  return (
    <Tag
      {...mergeProps(optionProps, hoverProps, pressProps)}
      className={clsx(
        s.base,
        hovered && s.hovered,
        pressed && s.pressed,
        selected && s.selected,
        textVariant['text-normal'],
        disabled && s.disabled,
        focusVisible && s.focusVisible
      )}
      ref={ref}
      data-focus-visible={focusVisible}
    >
      {item.rendered}
    </Tag>
  );
}
