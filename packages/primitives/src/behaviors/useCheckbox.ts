'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { useCheckbox as useCheckboxReactAria } from '@react-aria/checkbox';
import type { AriaCheckboxProps } from '@react-aria/checkbox';
import type { ToggleState } from '@react-stately/toggle';

export type UseCheckboxProps = AriaCheckboxProps;

export function useCheckbox(
  props: UseCheckboxProps,
  state: ToggleState,
  inputRef: RefObject<HTMLInputElement | null>
) {
  const { isIndeterminate: isIndeterminateProp } = props;

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const {
    isInvalid,
    isDisabled,
    isSelected,
    isReadOnly,
    isPressed,
    labelProps: labelPropsAria,
    inputProps: inputPropsAria,
    ...other
  } = useCheckboxReactAria(props, state, inputRef);

  const { hoverProps, isHovered } = useHover({
    isDisabled,
  });

  const labelProps = mergeProps(hoverProps, labelPropsAria);

  const inputProps = mergeProps(focusProps, inputPropsAria, {
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
