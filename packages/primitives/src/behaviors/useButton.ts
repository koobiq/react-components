'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { useButton as useButtonReactAria } from '@react-aria/button';

import type { ButtonOptions } from '../types';

export type UseButtonProps = ButtonOptions;

export function useButton(
  props: UseButtonProps,
  ref: RefObject<Element | null>
) {
  const { onClick, onPress, disabled, ...otherProps } = props;

  const {
    focusProps,
    isFocused: focused,
    isFocusVisible: focusVisible,
  } = useFocusRing({
    within: true,
  });

  const { hoverProps, isHovered: hovered } = useHover({
    ...props,
    isDisabled: disabled,
  });

  const { buttonProps: commonButtonProps, isPressed: pressed } =
    useButtonReactAria(
      {
        ...otherProps,
        onPress: onPress || onClick,
        isDisabled: disabled,
      },
      ref
    );

  const buttonProps = mergeProps(commonButtonProps, focusProps, hoverProps);

  return {
    pressed,
    hovered,
    focused,
    disabled,
    buttonProps,
    focusVisible,
  };
}

export type UseButtonReturn = ReturnType<typeof useButton>;
