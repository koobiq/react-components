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
  const { isIndeterminate: isIndeterminateProp } = props;

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const {
    isInvalid,
    isSelected,
    isReadOnly,
    isPressed,
    labelProps: labelPropsAria,
    inputProps: inputPropsAria,
    isDisabled: issDisabledAria,
    ...other
  } = useCheckboxGroupItemReactAria(props, state, inputRef);

  const isDisabled = state.isDisabled || issDisabledAria;

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

export type UseCheckboxGroupItemReturn = ReturnType<
  typeof useCheckboxGroupItem
>;
