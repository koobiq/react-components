import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { TextFieldProps } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldErrorProps,
  FieldInputProps,
  FieldLabelProps,
} from '../FieldComponents';

export const textareaPropVariant = ['filled', 'transparent'] as const;

export type TextareaPropVariant = (typeof textareaPropVariant)[number];

export const textareaPropExpand = ['auto-size', 'vertical-resize'] as const;
export type TextareaPropExpand = (typeof textareaPropExpand)[number];

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
    /** The content to display as the label. */
    label?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
    /**
     * The variant to use.
     * @default 'filled'
     */
    variant?: TextareaPropVariant;
    /**
     * If `true`, the input will indicate an error.
     * @default false
     */
    isInvalid?: boolean;
    /**
     * If `true`, the input can be selected but not changed by the user.
     * @default false
     */
    isReadOnly?: boolean;
    /** Message for the error state */
    errorMessage?: ReactNode;
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
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     */
    isLabelHidden?: boolean;
    /** The helper text content. */
    caption?: ReactNode;
    /**
     * If `true`, the label is displayed as required and the input element is required.
     * @default false
     */
    isRequired?: boolean;
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
      label?: FieldLabelProps;
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
