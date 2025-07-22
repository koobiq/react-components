'use client';

import type { RefObject } from 'react';

import { mergeProps, useFocusRing, useHover } from '@koobiq/react-core';
import { useSwitch as useSwitchReactAria } from '@react-aria/switch';
import type { AriaSwitchProps } from '@react-aria/switch';
import { useToggleState } from '@react-stately/toggle';

export type UseSwitchProps = AriaSwitchProps & { isInvalid?: boolean };

export function useSwitch(
  props: UseSwitchProps,
  ref: RefObject<HTMLInputElement | null>
) {
  const { isInvalid, isDisabled } = props;

  const state = useToggleState(props);

  const { hoverProps, isHovered } = useHover({
    isDisabled,
  });

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const {
    labelProps: commonLabelProps,
    inputProps: commonInputProps,
    ...other
  } = useSwitchReactAria(props, state, ref);

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
    isFocusVisible,
    ...other,
  };
}

export type UseSwitchReturn = ReturnType<typeof useSwitch>;
