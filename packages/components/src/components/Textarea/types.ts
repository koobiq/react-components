import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { UseTextFieldProps } from '@koobiq/react-primitives';

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

export type TextareaProps = ExtendableProps<
  {
    /** The content to display as the label. */
    label?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
    /**
     * The variant to use.
     * @default filled
     * */
    variant?: TextareaPropVariant;
    /**
     * If `true`, the input will indicate an error.
     * @default false
     * */
    error?: boolean;
    /** Message for the error state */
    errorMessage?: string | number;
    /**
     * If true, the input will take up the full width of its container.
     * @default false
     * */
    fullWidth?: boolean;
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     * */
    hiddenLabel?: boolean;
    /** The helper text content. */
    caption?: string | number;
    /**
     * If `true`, the label is displayed as required and the input element is required.
     * @default false
     * */
    required?: boolean;
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
    /** The props used for each slot inside. */
    slotProps?: {
      label?: FieldLabelProps;
      caption?: FieldCaptionProps;
      textarea?: FieldInputProps;
      errorMessage?: FieldErrorProps;
    };
  },
  Omit<UseTextFieldProps, 'inputElementType'>
>;

export type TextareaRef = ComponentRef<'textarea'>;
