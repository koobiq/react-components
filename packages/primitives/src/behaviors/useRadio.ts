'use client';

import type { RefObject } from 'react';

import { useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import type { ExtendableProps } from '@koobiq/react-core';
import { useRadio as useRadioReactAria } from '@react-aria/radio';
import type { AriaRadioProps } from '@react-aria/radio';
import type { RadioGroupState } from '@react-stately/radio';

export type UseRadioProps = ExtendableProps<
  {
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
  },
  Omit<AriaRadioProps, 'isDisabled'>
>;

export type UseRadioState = ExtendableProps<
  {
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /** It prevents the user from changing the value of the checkbox.
     * @default false
     */
    readonly?: boolean;
    /**
     * If `true`, the input element is required.
     * @default false
     * */
    required?: boolean;
    /**
     * If `true`, the component will indicate an error.
     * @default false
     * */
    error?: boolean;
  },
  Omit<
    RadioGroupState,
    'isDisabled' | 'isReadOnly' | 'isRequired' | 'isInvalid'
  >
>;

export function useRadio(
  props: UseRadioProps,
  state: UseRadioState,
  ref: RefObject<HTMLInputElement | null>
) {
  const { disabled } = props;

  const {
    inputProps: commonInputProps,
    labelProps: commonLabelProps,
    isDisabled,
    isSelected,
    isPressed,
  } = useRadioReactAria(
    {
      ...props,
      isDisabled: disabled,
    },
    Object.assign(state, {
      isInvalid: state.error || false,
      isReadOnly: state.readonly || false,
      isDisabled: state.disabled || false,
      isRequired: state.required || false,
    }),
    ref
  );

  const { hoverProps, isHovered } = useHover({
    isDisabled: disabled,
  });

  const labelProps = mergeProps(hoverProps, commonLabelProps);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const inputProps = mergeProps(focusProps, commonInputProps, {
    ref,
  });

  return {
    labelProps,
    inputProps,
    pressed: isPressed,
    hovered: isHovered,
    focused: isFocused,
    checked: isSelected,
    disabled: isDisabled,
    focusVisible: isFocusVisible,
  };
}

export type UseRadioReturn = ReturnType<typeof useRadio>;
