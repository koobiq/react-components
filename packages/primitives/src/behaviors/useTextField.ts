'use client';

import type { RefObject } from 'react';

import type { AriaTextFieldOptions } from '@react-aria/textfield';
import { useTextField as useTextFieldReactAria } from '@react-aria/textfield';

export type UseTextFieldProps = {
  error?: boolean;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  inputElementType?: 'input' | 'textarea';
} & Omit<
  AriaTextFieldOptions<'input' | 'textarea'>,
  'isDisabled' | 'isInvalid' | 'isRequired' | 'isReadOnly'
>;

export function useTextField(
  props: UseTextFieldProps,
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
) {
  const { disabled, error, label, readonly, required, ...other } = props;

  const { isInvalid, ...textFieldProps } = useTextFieldReactAria(
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

export type UseTextFieldReturn = ReturnType<typeof useTextField>;
