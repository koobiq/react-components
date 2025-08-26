import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { TextFieldProps } from '@koobiq/react-primitives';

import {
  type FieldCaptionProps,
  type FieldContentGroupPropVariant,
  fieldContentGroupPropVariant,
  type FieldErrorProps,
  type FieldInputProps,
} from '../FieldComponents';
import {
  type FormControlPropLabelAlign,
  formControlPropLabelAlign,
  type FormControlPropLabelPlacement,
  formControlPropLabelPlacement,
} from '../FormControl';
import type { FormControlLabelProps } from '../FormControlLabel';

export const textareaPropVariant = fieldContentGroupPropVariant;

export type TextareaPropVariant = FieldContentGroupPropVariant;

export const textareaPropExpand = ['auto-size', 'vertical-resize'] as const;
export type TextareaPropExpand = (typeof textareaPropExpand)[number];

export const textareaPropLabelPlacement = formControlPropLabelPlacement;
export type TextareaPropLabelPlacement = FormControlPropLabelPlacement;

export const textareaPropLabelAlign = formControlPropLabelAlign;
export type TextareaPropLabelAlign = FormControlPropLabelAlign;

type TextareaDeprecatedProps = {
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
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   * @deprecated
   * The "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.
   */
  hiddenLabel?: boolean;
  /**
   * If `true`, the input can be selected but not changed by the user.
   * @default false
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.
   */
  readonly?: boolean;
};

export type TextareaProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /**
     * The variant to use.
     * @default 'filled'
     */
    variant?: TextareaPropVariant;
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
    /**
     * The label's overall position relative to the element it is labeling.
     * @default 'top'
     */
    labelPlacement?: TextareaPropLabelPlacement;
    /**
     * The label's horizontal alignment relative to the element it is labeling.
     * @default 'start'
     */
    labelAlign?: TextareaPropLabelAlign;
    /** The helper text content. */
    caption?: ReactNode;
    /** The rows property specifies the visible height of a text area, in lines. */
    rows?: number;
    /** The cols property specifies the visible width of a text area. */
    cols?: number;
    /**
     * The expand property determines how the block size (height) of the field will change:
     *
     * `autoSize` — auto-change the block size (height) of the field according to the entered value.
     * `verticalResize` — the ability to stretch the field vertically.
     */
    expand?: TextareaPropExpand;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      label?: FormControlLabelProps;
      caption?: FieldCaptionProps;
      textarea?: FieldInputProps<'textarea'>;
      errorMessage?: FieldErrorProps;
    };
  },
  TextareaDeprecatedProps &
    Omit<
      TextFieldProps<HTMLTextAreaElement>,
      | 'description'
      | 'validationBehavior'
      | 'validationState'
      | 'validate'
      | 'children'
      | 'style'
      | 'className'
      | 'inputElementType'
    >
>;

export type TextareaRef = ComponentRef<'textarea'>;
