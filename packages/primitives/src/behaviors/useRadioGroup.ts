import type { ExtendableProps } from '@koobiq/react-core';
import {
  useRadioGroup as useRadioGroupReactAria,
  type AriaRadioGroupProps,
} from '@react-aria/radio';
import type { RadioGroupState } from '@react-stately/radio';

export type UseRadioGroupProps = ExtendableProps<
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
    AriaRadioGroupProps,
    'isDisabled' | 'isReadOnly' | 'isRequired' | 'isInvalid'
  >
>;

export type UseRadioGroupState = ExtendableProps<
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

export function useRadioGroup(
  props: UseRadioGroupProps,
  state: UseRadioGroupState
) {
  const { isInvalid, ...other } = useRadioGroupReactAria(
    {
      ...props,
      isInvalid: props.error || false,
      isReadOnly: props.readonly || false,
      isDisabled: props.disabled || false,
      isRequired: props.required || false,
    },
    Object.assign(state, {
      isInvalid: state.error || false,
      isReadOnly: state.readonly || false,
      isDisabled: state.disabled || false,
      isRequired: state.required || false,
    })
  );

  return { error: isInvalid, ...other };
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>;
