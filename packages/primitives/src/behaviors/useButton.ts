'use client';

import type { ElementType, RefObject } from 'react';

import {
  useHover,
  mergeProps,
  useFocusRing,
  type HoverEvents,
} from '@koobiq/react-core';
import {
  type AriaButtonOptions,
  useButton as useButtonReactAria,
} from '@react-aria/button';

export type UseButtonProps<E extends ElementType> = AriaButtonOptions<E> &
  HoverEvents;

export function useButton<E extends ElementType>(
  props: UseButtonProps<E>,
  ref: RefObject<Element | null>
) {
  const { isDisabled } = props;

  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { hoverProps, isHovered } = useHover(props);

  const { buttonProps: buttonPropsReactAria, isPressed } = useButtonReactAria(
    props,
    ref
  );

  const buttonProps = mergeProps(buttonPropsReactAria, focusProps, hoverProps);

  return {
    isPressed,
    isHovered,
    isFocused,
    isDisabled,
    buttonProps,
    isFocusVisible,
  };
}

export type UseButtonReturn<E extends ElementType> = ReturnType<
  typeof useButton<E>
>;
