'use client';

import type { RefObject } from 'react';

import type { AriaTextFieldProps } from 'react-aria';
import { useTextField as useTextFieldReactAria } from 'react-aria';

export type UseTextFieldProps = {
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
} & Omit<
  AriaTextFieldProps,
  'isDisabled' | 'isInvalid' | 'isRequired' | 'isReadOnly'
>;

export function useTextField(
  props: UseTextFieldProps,
  ref: RefObject<HTMLInputElement | null>
) {
  const { disabled, error, label, readonly, required, ...other } = props;

  const { isInvalid, ...textFieldProps } = useTextFieldReactAria<'input'>(
    {
      isDisabled: disabled,
      isReadOnly: readonly,
      isRequired: required,
      isInvalid: error,
      label,
      errorMessage: error ? label : undefined,
      ...other,
    },
    ref
  );

  return {
    error: isInvalid,
    ...textFieldProps,
  };
}
