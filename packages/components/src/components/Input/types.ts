import type { ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { UseTextFieldProps } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldControlProps,
  FieldErrorProps,
  FieldInputProps,
  FieldLabelProps,
} from './components';

export const inputPropVariant = ['filled', 'transparent'] as const;

export type InputPropVariant = (typeof inputPropVariant)[number];

export type InputProps = ExtendableProps<
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
    variant?: InputPropVariant;
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
    /** Slots */
    slotProps?: {
      root?: FieldControlProps;
      label?: FieldLabelProps;
      caption?: FieldCaptionProps;
      input?: FieldInputProps;
      errorMessage?: FieldErrorProps;
    };
  },
  UseTextFieldProps
>;
