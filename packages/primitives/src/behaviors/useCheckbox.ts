'use client';

import type { Ref } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { RefObject } from '@react-types/shared';
import {
  useHover,
  mergeProps,
  useFocusRing,
  useCheckbox as useCheckboxReactAria,
} from 'react-aria';
import type { AriaCheckboxProps, CheckboxAria } from 'react-aria';
import { useToggleState } from 'react-stately';

export type UseCheckboxProps = ExtendableProps<
  {
    error?: boolean;
    checked?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    required?: boolean;
    indeterminate?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
  },
  Omit<
    AriaCheckboxProps,
    | 'isRequired'
    | 'isInvalid'
    | 'isReadOnly'
    | 'isSelected'
    | 'isDisabled'
    | 'isIndeterminate'
    | 'defaultSelected'
  >
>;

export function useCheckbox(
  props: UseCheckboxProps,
  inputRef: RefObject<HTMLInputElement | null>
) {
  const {
    error,
    checked,
    disabled,
    readonly,
    required,
    indeterminate,
    defaultChecked,
    onChange,
  } = props;

  const state = useToggleState({
    isSelected: checked,
    defaultSelected: defaultChecked,
    onChange,
  });

  const { hoverProps, isHovered } = useHover({
    isDisabled: disabled,
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
  } = useCheckboxReactAria(
    {
      ...props,
      isInvalid: error,
      isDisabled: disabled,
      isIndeterminate: indeterminate,
      isReadOnly: readonly,
      isRequired: required,
    },
    state,
    inputRef
  );

  const labelProps: CheckboxAria['labelProps'] = mergeProps(
    hoverProps,
    commonLabelProps
  );

  const inputProps: CheckboxAria['inputProps'] & {
    ref: Ref<HTMLInputElement>;
  } = mergeProps(focusProps, commonInputProps, {
    ref: inputRef,
  });

  return {
    labelProps,
    inputProps,
    indeterminate,
    error: isInvalid,
    pressed: isPressed,
    hovered: isHovered,
    focused: isFocused,
    checked: isSelected,
    disabled: isDisabled,
    readonly: isReadOnly,
    focusVisible: isFocusVisible,
    ...other,
  };
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>;
