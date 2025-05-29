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
  const { isDisabled } = props;

  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { hoverProps, isHovered } = useHover(props);

  const { buttonProps: commonButtonProps, isPressed } = useButtonReactAria(
    props,
    ref
  );

  const buttonProps = mergeProps(commonButtonProps, focusProps, hoverProps);

  return {
    isPressed,
    isHovered,
    isFocused,
    isDisabled,
    buttonProps,
    isFocusVisible,
  };
}

export type UseButtonReturn = ReturnType<typeof useButton>;
