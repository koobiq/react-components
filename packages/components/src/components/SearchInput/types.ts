import type { ComponentRef, CSSProperties, ReactNode } from 'react';

import type { DataAttributeProps, ExtendableProps } from '@koobiq/react-core';
import type { AriaSearchFieldProps } from '@koobiq/react-primitives';

import {
  type FieldCaptionProps,
  type FieldErrorProps,
  type FieldInputProps,
  type FieldContentGroupProps,
  type FieldContentGroupPropVariant,
} from '../FieldComponents';
import { fieldContentGroupPropVariant } from '../FieldComponents';
import {
  type FormControlProps,
  type FormControlPropLabelAlign,
  formControlPropLabelAlign,
  type FormControlPropLabelPlacement,
  formControlPropLabelPlacement,
} from '../FormControl';
import type { FormControlLabelProps } from '../FormControlLabel';
import type { IconButtonProps } from '../IconButton';

export const searchInputPropVariant = fieldContentGroupPropVariant;
export type SearchInputPropVariant = FieldContentGroupPropVariant;

export const searchInputPropLabelPlacement = formControlPropLabelPlacement;
export type SearchInputPropLabelPlacement = FormControlPropLabelPlacement;
export const searchInputPropLabelAlign = formControlPropLabelAlign;
export type SearchInputPropLabelAlign = FormControlPropLabelAlign;

export type SearchInputProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles */
    style?: CSSProperties;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     */
    isLabelHidden?: boolean;
    /**
     * The label's overall position relative to the element it is labeling.
     * @default 'top'
     */
    labelPlacement?: SearchInputPropLabelPlacement;
    /**
     * The label's horizontal alignment relative to the element it is labeling.
     * @default 'start'
     */
    labelAlign?: SearchInputPropLabelAlign;
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FormControlProps;
      label?: FormControlLabelProps;
      group?: FieldContentGroupProps;
      input?: FieldInputProps;
      caption?: FieldCaptionProps;
      errorMessage?: FieldErrorProps;
      clearButton?: IconButtonProps;
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
     * If `true`, the input will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
  } & DataAttributeProps,
  Omit<AriaSearchFieldProps, 'description' | 'errorMessage' | 'validationState'>
>;

export type SearchInputRef = ComponentRef<'input'>;
