import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { NumberField, NumberFieldProps } from '@koobiq/react-primitives';

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

export const inputNumberPropVariant = formFieldControlGroupPropVariant;

export type InputNumberPropVariant = FormFieldControlGroupPropVariant;

export const inputNumberPropLabelPlacement = formFieldPropLabelPlacement;
export type InputNumberPropLabelPlacement = FormFieldPropLabelPlacement;
export const inputNumberPropLabelAlign = formFieldPropLabelAlign;
export type InputNumberPropLabelAlign = FormFieldPropLabelAlign;

type InputNumberDeprecatedProps = {
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

export type InputNumberProps = ExtendableProps<
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
    variant?: InputNumberPropVariant;
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
    labelPlacement?: InputNumberPropLabelPlacement;
    /**
     * The label's horizontal alignment relative to the element it is labeling.
     * @default 'start'
     */
    labelAlign?: InputNumberPropLabelAlign;
    /** The helper text content. */
    caption?: ReactNode;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FormFieldProps<typeof NumberField>;
      label?: FormFieldLabelProps;
      input?: FormFieldInputProps;
      caption?: FormFieldCaptionProps;
      group?: FormFieldControlGroupProps;
      errorMessage?: FormFieldErrorProps;
    };
  } & InputNumberDeprecatedProps,
  Omit<
    NumberFieldProps,
    'description' | 'children' | 'inputElementType' | 'validationState'
  >
>;

export type InputNumberRef = ComponentRef<'input'>;
