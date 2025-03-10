import type { ExtendableProps } from '@koobiq/react-core';
import type { RadioGroupProps } from '@react-stately/radio';
import { useRadioGroupState as useRadioGroupStateReactAria } from '@react-stately/radio';

export type UseRadioGroupStateProps = ExtendableProps<
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
    RadioGroupProps,
    'isDisabled' | 'isReadOnly' | 'isRequired' | 'isInvalid'
  >
>;

export function useRadioGroupState(props: UseRadioGroupStateProps) {
  const { isDisabled, isInvalid, isReadOnly, isRequired, ...other } =
    useRadioGroupStateReactAria({
      ...props,
      isInvalid: props.error || false,
      isReadOnly: props.readonly || false,
      isDisabled: props.disabled || false,
      isRequired: props.required || false,
    });

  return {
    error: isInvalid,
    readonly: isReadOnly,
    required: isRequired,
    disabled: isDisabled,
    ...other,
  };
}

export type UseRadioGroupStateReturn = ReturnType<typeof useRadioGroupState>;

export type RadioGroupState = UseRadioGroupStateReturn;
