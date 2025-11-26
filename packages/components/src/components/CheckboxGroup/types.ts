import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type { AriaCheckboxGroupProps } from '@koobiq/react-primitives';

import type {
  FormFieldProps,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldCaptionProps,
  FormFieldPropLabelAlign,
  FormFieldPropLabelPlacement,
} from '../FormField';
import {
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';

export const checkboxGroupPropSize = ['normal', 'big'] as const;

export type CheckboxGroupPropSize = (typeof checkboxGroupPropSize)[number];

export const checkboxGroupPropOrientation = ['horizontal', 'vertical'] as const;

export type CheckboxGroupPropOrientation =
  (typeof checkboxGroupPropOrientation)[number];

export const checkboxGroupPropLabelPlacement = formFieldPropLabelPlacement;
export type CheckboxGroupPropLabelPlacement = FormFieldPropLabelPlacement;
export const checkboxGroupPropLabelAlign = formFieldPropLabelAlign;
export type CheckboxGroupPropLabelAlign = FormFieldPropLabelAlign;

export type CheckboxGroupProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** The helper text content. */
  caption?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
  /** The content of the component. */
  children?: ReactNode;
  /**
   * Size.
   * @default 'normal'
   */
  size?: CheckboxGroupPropSize;
  /**
   * The axis the Checkbox Button(s) should align with.
   * @default 'vertical'
   */
  orientation?: CheckboxGroupPropOrientation;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   */
  isLabelHidden?: boolean;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: CheckboxGroupPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: CheckboxGroupPropLabelAlign;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: FormFieldProps;
    caption?: FormFieldCaptionProps;
    errorMessage?: FormFieldErrorProps;
    label?: FormFieldLabelProps<'span'>;
    checkboxGroup?: ComponentPropsWithRef<'div'>;
  };
} & Omit<AriaCheckboxGroupProps, 'description' | 'validationState'>;
