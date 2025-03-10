import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import { useLocale } from '@react-aria/i18n';
import type { AriaNumberFieldProps } from '@react-aria/numberfield';
import { useNumberField as useNumberFieldReactAria } from '@react-aria/numberfield';

import { useNumberFieldState } from './useNumberFieldState';

export type UseNumberFieldProps = ExtendableProps<
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
    AriaNumberFieldProps,
    'isDisabled' | 'isInvalid' | 'isRequired' | 'isReadOnly' | 'isWheelDisabled'
  >
>;

export function useNumberField(
  props: UseNumberFieldProps,
  ref: RefObject<HTMLInputElement | null>
) {
  const { disabled, error, readonly, required, ...other } = props;
  const { locale } = useLocale();

  const state = useNumberFieldState({ ...props, locale });

  return useNumberFieldReactAria(
    {
      isDisabled: disabled,
      isReadOnly: readonly,
      isRequired: required,
      isInvalid: error,
      ...other,
    },
    state,
    ref
  );
}

export type UseNumberFieldReturn = ReturnType<typeof useNumberField>;
