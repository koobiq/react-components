'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { useRadio as useRadioReactAria } from '@react-aria/radio';
import type { AriaRadioProps } from '@react-aria/radio';
import type { RadioGroupState } from '@react-stately/radio';

export type UseRadioProps = AriaRadioProps;

export type UseRadioState = RadioGroupState;

export function useRadio(
  props: UseRadioProps,
  state: UseRadioState,
  ref: RefObject<HTMLInputElement | null>
) {
  const {
    isDisabled,
    isSelected,
    isPressed,
    inputProps: inputPropsAria,
    labelProps: labelPropsAria,
  } = useRadioReactAria(
    props,
    Object.assign(state, {
      isInvalid: state.isInvalid || false,
      isReadOnly: state.isReadOnly || false,
      isDisabled: state.isDisabled || false,
      isRequired: state.isRequired || false,
    }),
    ref
  );

  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || state.isReadOnly,
  });

  const labelProps = mergeProps(hoverProps, labelPropsAria);

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const inputProps = mergeProps(focusProps, inputPropsAria, {
    ref,
  });

  return {
    labelProps,
    inputProps,
    isPressed,
    isHovered,
    isFocused,
    isSelected,
    isDisabled,
    isFocusVisible,
    isReadOnly: state.isReadOnly,
  };
}

export type UseRadioReturn = ReturnType<typeof useRadio>;
