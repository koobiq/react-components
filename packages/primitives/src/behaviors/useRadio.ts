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
    inputProps: commonInputProps,
    labelProps: commonLabelProps,
    isDisabled,
    isSelected,
    isPressed,
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
    isDisabled,
  });

  const labelProps = mergeProps(hoverProps, commonLabelProps);

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const inputProps = mergeProps(focusProps, commonInputProps, {
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
  };
}

export type UseRadioReturn = ReturnType<typeof useRadio>;
