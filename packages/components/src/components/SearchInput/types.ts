import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaSearchFieldProps } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldErrorProps,
  FieldInputGroupProps,
  FieldInputGroupPropVariant,
  FieldInputProps,
  FieldLabelProps,
} from '../FieldComponents';

export type SearchInputPropVariant = FieldInputGroupPropVariant;

export type SearchInputRef = ComponentRef<'input'>;
export type SearchInputProps = ExtendableProps<
  {
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     */
    isLabelHidden?: boolean;
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      label?: FieldLabelProps;
      group?: FieldInputGroupProps;
      input?: FieldInputProps;
      caption?: FieldCaptionProps;
      errorMessage?: FieldErrorProps;
    };
    /** An error message for the field. */
    errorMessage?: ReactNode;
    /** The helper text content. */
    caption?: ReactNode;
    /**
     * The variant to use.
     * @default 'filled'
     */
    variant?: SearchInputPropVariant;
    /**
     * If true, the input will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
  },
  Omit<AriaSearchFieldProps, 'description' | 'errorMessage' | 'validationState'>
>;
