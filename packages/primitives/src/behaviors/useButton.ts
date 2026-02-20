'use client';

import type { ElementType, RefObject } from 'react';

import type { DOMAttributes, HoverEvents } from '@koobiq/react-core';
import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { useButton as useButtonReactAria } from '@react-aria/button';
import type { AriaButtonOptions, ButtonAria } from '@react-aria/button';

export type UseButtonProps<E extends ElementType> = AriaButtonOptions<E> &
  HoverEvents;

export type ButtonOptions = AriaButtonOptions<ElementType>;

export type UseButtonReturn = {
  isPressed: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDisabled?: boolean;
  isFocusVisible: boolean;
  buttonProps: ButtonAria<DOMAttributes>['buttonProps'];
};

export function useButton<E extends ElementType>(
  props: UseButtonProps<E>,
  ref: RefObject<Element | null>
): UseButtonReturn {
  const { isDisabled } = props;

  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: props.isDisabled,
  });

  const { buttonProps: buttonPropsAria, isPressed } = useButtonReactAria(
    props,
    ref
  );

  const buttonProps = mergeProps(buttonPropsAria, focusProps, hoverProps);

  return {
    isPressed,
    isHovered,
    isFocused,
    isDisabled,
    buttonProps,
    isFocusVisible,
  };
}
