'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { useCheckbox as useCheckboxReactAria } from '@react-aria/checkbox';
import type { AriaCheckboxProps } from '@react-aria/checkbox';
import { useToggleState } from '@react-stately/toggle';

export type UseCheckboxProps = AriaCheckboxProps;

export function useCheckbox(
  props: UseCheckboxProps,
  inputRef: RefObject<HTMLInputElement | null>
) {
  const { isDisabled: isDisabledProp, isIndeterminate: isIndeterminateProp } =
    props;

  const state = useToggleState(props);

  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabledProp,
  });

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const {
    labelProps: commonLabelProps,
    inputProps: commonInputProps,
    isInvalid,
    isDisabled,
    isSelected,
    isReadOnly,
    isPressed,
    ...other
  } = useCheckboxReactAria(props, state, inputRef);

  const labelProps = mergeProps(hoverProps, commonLabelProps);

  const inputProps = mergeProps(focusProps, commonInputProps, {
    ref: inputRef,
  });

  return {
    isInvalid,
    isPressed,
    isHovered,
    isFocused,
    isSelected,
    isDisabled,
    isReadOnly,
    labelProps,
    inputProps,
    isFocusVisible,
    isIndeterminate: isIndeterminateProp,
    ...other,
  };
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>;
