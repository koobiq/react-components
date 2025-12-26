import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { TextField, TextFieldProps } from '@koobiq/react-primitives';

import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldInputProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldPropLabelAlign,
  FormFieldControlGroupProps,
  FormFieldPropLabelPlacement,
  FormFieldControlGroupPropVariant,
} from '../FormField';
import {
  formFieldControlGroupPropVariant,
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';

export const inputPropVariant = formFieldControlGroupPropVariant;
export const inputPropLabelPlacement = formFieldPropLabelPlacement;
export type InputPropVariant = FormFieldControlGroupPropVariant;
export type InputPropLabelPlacement = FormFieldPropLabelPlacement;
export const inputPropLabelAlign = formFieldPropLabelAlign;
export type InputPropLabelAlign = FormFieldPropLabelAlign;

type InputDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the input will indicate an error.
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * If `true`, the label is displayed as required and the input element is required.
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
  /**
   * If `true`, the input can be selected but not changed by the user.
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
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
    /**
     * If true, the input will take up the full width of its container.
     */
    fullWidth?: boolean;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     */
    isLabelHidden?: boolean;
    /**
     * The label's overall position relative to the element it is labeling.
     * @default 'top'
     */
    labelPlacement?: InputPropLabelPlacement;
    /**
     * The label's horizontal alignment relative to the element it is labeling.
     * @default 'start'
     */
    labelAlign?: InputPropLabelAlign;
    /** Whether the field can be emptied. */
    isClearable?: boolean;
    /** Handler that is called when the clear button is clicked. */
    onClear?: () => void;
    /** The helper text content. */
    caption?: ReactNode;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FormFieldProps<typeof TextField<HTMLInputElement>>;
      label?: FormFieldLabelProps;
      caption?: FormFieldCaptionProps;
      group?: FormFieldControlGroupProps;
      errorMessage?: FormFieldErrorProps;
      clearButton?: IconButtonProps;
      input?: FormFieldInputProps;
    };
  } & InputDeprecatedProps,
  Omit<
    TextFieldProps<HTMLInputElement>,
    'description' | 'children' | 'inputElementType' | 'validationState'
  >
>;

export type InputRef = ComponentRef<'input'>;
