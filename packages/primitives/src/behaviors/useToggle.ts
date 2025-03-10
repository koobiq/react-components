'use client';

import type { RefObject } from 'react';

import {
  mergeProps,
  useFocusRing,
  useHover,
  useToggleState,
} from '@koobiq/react-core';
import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaToggleProps } from '@react-aria/toggle';
import { useToggle as useToggleReactAria } from '@react-aria/toggle';

export type UseToggleProps = ExtendableProps<
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
    /** The default checked state. Use when the component is not controlled. */
    defaultChecked?: boolean;
    /** Callback fired when the state is changed. */
    onChange?: (checked: boolean) => void;
  },
  Omit<
    AriaToggleProps,
    | 'isRequired'
    | 'isInvalid'
    | 'isReadOnly'
    | 'isSelected'
    | 'isDisabled'
    | 'defaultSelected'
    | 'onChange'
  >
>;

export function useToggle(
  props: UseToggleProps,
  ref: RefObject<HTMLInputElement | null>
) {
  const { error, checked, disabled, required, defaultChecked, onChange } =
    props;

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
  } = useToggleReactAria(
    {
      ...props,
      isInvalid: error,
      isDisabled: disabled,
      isRequired: required,
    },
    state,
    ref
  );

  const labelProps = mergeProps(hoverProps, commonLabelProps);

  const inputProps = mergeProps(focusProps, commonInputProps, {
    ref,
  });

  return {
    labelProps,
    inputProps,
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

export type UseToggleReturn = ReturnType<typeof useToggle>;
