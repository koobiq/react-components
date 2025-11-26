'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { useCheckboxGroupItem as useCheckboxGroupItemReactAria } from '@react-aria/checkbox';
import type { CheckboxGroupState } from '@react-stately/checkbox';
import type { AriaCheckboxGroupItemProps } from '@react-types/checkbox';

export type UseCheckboxGroupItemProps = AriaCheckboxGroupItemProps;

export function useCheckboxGroupItem(
  props: UseCheckboxGroupItemProps,
  state: CheckboxGroupState,
  inputRef: RefObject<HTMLInputElement | null>
) {
  const { isDisabled: isDisabledProp, isIndeterminate: isIndeterminateProp } =
    props;

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
  } = useCheckboxGroupItemReactAria(props, state, inputRef);

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

export type UseCheckboxGroupItemReturn = ReturnType<
  typeof useCheckboxGroupItem
>;
