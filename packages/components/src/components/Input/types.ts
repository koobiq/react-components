import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { TextFieldProps } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldErrorProps,
  FieldInputProps,
  FieldLabelProps,
  FieldInputGroupProps,
  FieldControlProps,
} from '../FieldComponents';

export const inputPropVariant = ['filled', 'transparent'] as const;

export type InputPropVariant = (typeof inputPropVariant)[number];

type InputDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @default false
   *
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the input will indicate an error.
   * @default false
   *
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * If `true`, the label is displayed as required and the input element is required.
   * @default false
   *
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
  /**
   * If `true`, the input can be selected but not changed by the user.
   * @default false
   *
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   *
   * @deprecated
   * The "hiddenLabel" prop is deprecated. Use "hideLabel" prop to replace it.
   */
  hiddenLabel?: boolean;
};

export type InputProps = ExtendableProps<
  {
    /** The content to display as the label. */
    label?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
    /** Temporary text that occupies the text input when it is empty. */
    placeholder?: TextFieldProps['placeholder'];
    /** The current value (controlled). */
    value?: TextFieldProps['value'];
    /** The default value (uncontrolled). */
    defaultValue?: TextFieldProps['defaultValue'];
    /** Handler that is called when the value changes. */
    onChange?: TextFieldProps['onChange'];
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /**
     * The variant to use.
     * @default filled
     */
    variant?: InputPropVariant;
    /**
     * If `true`, the input will indicate an error.
     * @default false
     */
    isInvalid?: boolean;
    /** Message for the error state */
    errorMessage?: string | number;
    /**
     * If true, the input will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /**
     * If `true`, the component is disabled.
     * @default false
     */
    isDisabled?: boolean;
    /** If `true`, the input can be selected but not changed by the user.
     * @default false
     */
    isReadOnly?: boolean;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     */
    hideLabel?: boolean;
    /** The helper text content. */
    caption?: string | number;
    /**
     * If `true`, the label is displayed as required and the input element is required.
     * @default false
     */
    isRequired?: boolean;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FieldControlProps;
      label?: FieldLabelProps;
      caption?: FieldCaptionProps;
      group?: FieldInputGroupProps;
      errorMessage?: FieldErrorProps;
      input?: FieldInputProps<'input'>;
    };
  } & InputDeprecatedProps,
  Omit<TextFieldProps, 'description' | 'validationBehavior' | 'validate'>
>;

export type InputRef = ComponentRef<'input'>;
