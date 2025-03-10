'use client';

import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import {
  useHover,
  mergeProps,
  useFocusRing,
  useToggleState,
} from '@koobiq/react-core';
import { useCheckbox as useCheckboxReactAria } from '@react-aria/checkbox';
import type { AriaCheckboxProps } from '@react-aria/checkbox';

export type UseCheckboxProps = ExtendableProps<
  {
    /**
     * If `true`, the component will indicate an error.
     * @default false
     * */
    error?: boolean;
    /**
     * If `true`, the component is checked.
     * @default false
     * */
    checked?: boolean;
    /** It prevents the user from changing the value of the checkbox.
     * @default false
     */
    readonly?: boolean;
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /**
     * If `true`, the input element is required.
     * @default false
     * */
    required?: boolean;
    /**
     * If `true`, the component appears indeterminate.
     * @default false
     * */
    indeterminate?: boolean;
    /** The default checked state. Use when the component is not controlled. */
    defaultChecked?: boolean;
    /** Callback fired when the state is changed. */
    onChange?: (checked: boolean) => void;
  },
  Omit<
    AriaCheckboxProps,
    | 'onChange'
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

  const labelProps = mergeProps(hoverProps, commonLabelProps);

  const inputProps = mergeProps(focusProps, commonInputProps, {
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
