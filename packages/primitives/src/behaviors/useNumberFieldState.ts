import type { ExtendableProps } from '@koobiq/react-core';
import type { NumberFieldStateOptions } from '@react-stately/numberfield';
import { useNumberFieldState as useNumberFieldStateReactAria } from '@react-stately/numberfield';

export type UseNumberFieldStateProps = ExtendableProps<
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
    NumberFieldStateOptions,
    'isDisabled' | 'isReadOnly' | 'isRequired' | 'isInvalid'
  >
>;

export function useNumberFieldState(props: UseNumberFieldStateProps) {
  return useNumberFieldStateReactAria({
    ...props,
    isInvalid: props.error || false,
    isReadOnly: props.readonly || false,
    isDisabled: props.disabled || false,
    isRequired: props.required || false,
  });
}

export type UseNumberFieldStateReturn = ReturnType<typeof useNumberFieldState>;
