'use client';

import type { RefObject } from 'react';

import { mergeProps, useFocusRing, useHover } from '@koobiq/react-core';
import type { PressEvents } from '@koobiq/react-core';
import { useSwitch as useSwitchReactAria } from '@react-aria/switch';
import type { AriaSwitchProps } from '@react-aria/switch';
import { useToggleState } from '@react-stately/toggle';

export type UseSwitchProps = AriaSwitchProps & {
  isInvalid?: boolean;
  /** Whether this switch is loading. */
  isLoading?: boolean;
} & PressEvents;

export function useSwitch(
  props: UseSwitchProps,
  ref: RefObject<HTMLInputElement | null>
) {
  const { isInvalid, isDisabled, isLoading } = props;

  const state = useToggleState({
    ...props,
    isReadOnly: props.isReadOnly || isLoading,
  });

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const {
    labelProps: commonLabelProps,
    inputProps: commonInputProps,
    isReadOnly,
    ...other
  } = useSwitchReactAria(
    isLoading
      ? {
          ...props,
          onPress: undefined,
          onPressStart: undefined,
          onPressEnd: undefined,
          onPressChange: undefined,
          onPressUp: undefined,
          onClick: undefined,
          onKeyDown: undefined,
          onKeyUp: undefined,
        }
      : props,
    state,
    ref
  );

  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || isReadOnly || isLoading,
  });

  const labelProps = mergeProps(hoverProps, commonLabelProps);

  const inputProps = mergeProps(focusProps, commonInputProps, {
    ref,
  });

  return {
    labelProps,
    inputProps: { ...inputProps, 'aria-invalid': isInvalid },
    isInvalid,
    isHovered,
    isFocused,
    isReadOnly,
    isFocusVisible,
    ...other,
  };
}

export type UseSwitchReturn = ReturnType<typeof useSwitch>;
