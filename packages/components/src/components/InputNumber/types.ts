import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { UseNumberFieldProps } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldErrorProps,
  FieldInputProps,
  FieldLabelProps,
} from '../FieldComponents';

export const inputNumberPropVariant = ['filled', 'transparent'] as const;

export type InputNumberPropVariant = (typeof inputNumberPropVariant)[number];

export type InputNumberProps = ExtendableProps<
  {
    /** The content to display as the label. */
    label?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /**
     * The variant to use.
     * @default filled
     * */
    variant?: InputNumberPropVariant;
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
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      label?: FieldLabelProps;
      input?: FieldInputProps;
      caption?: FieldCaptionProps;
      errorMessage?: FieldErrorProps;
    };
  },
  Omit<UseNumberFieldProps, 'inputElementType'>
>;

export type InputNumberRef = ComponentRef<'input'>;
