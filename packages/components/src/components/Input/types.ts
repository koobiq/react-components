import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { TextField, TextFieldProps } from '@koobiq/react-primitives';

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
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the input will indicate an error.
   * @default false
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * If `true`, the label is displayed as required and the input element is required.
   * @default false
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
  /**
   * If `true`, the input can be selected but not changed by the user.
   * @default false
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   * @deprecated
   * The "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.
   */
  hiddenLabel?: boolean;
};

export type InputProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /**
     * The variant to use.
     * @default 'filled'
     */
    variant?: InputPropVariant;
    /** An error message for the field. */
    errorMessage?: ReactNode;
    /**
     * If true, the input will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     */
    isLabelHidden?: boolean;
    /** The helper text content. */
    caption?: ReactNode;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FieldControlProps<typeof TextField<HTMLInputElement>>;
      label?: FieldLabelProps;
      caption?: FieldCaptionProps;
      group?: FieldInputGroupProps;
      errorMessage?: FieldErrorProps;
      input?: FieldInputProps<'input'>;
    };
  } & InputDeprecatedProps,
  Omit<
    TextFieldProps<HTMLInputElement>,
    | 'description'
    | 'validationBehavior'
    | 'validate'
    | 'children'
    | 'inputElementType'
  >
>;

export type InputRef = ComponentRef<'input'>;
