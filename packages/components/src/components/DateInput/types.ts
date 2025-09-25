import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { AriaDateFieldProps, DateValue } from '@koobiq/react-primitives';

import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldPropLabelAlign,
  FormFieldInputDateProps,
  FormFieldControlGroupProps,
  FormFieldPropLabelPlacement,
  FormFieldControlGroupPropVariant,
} from '../FormField';
import {
  formFieldControlGroupPropVariant,
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';

export const dateInputPropVariant = formFieldControlGroupPropVariant;

export type DateInputPropVariant = FormFieldControlGroupPropVariant;

export const dateInputPropLabelPlacement = formFieldPropLabelPlacement;
export type DateInputPropLabelPlacement = FormFieldPropLabelPlacement;
export const dateInputPropLabelAlign = formFieldPropLabelAlign;
export type DateInputPropLabelAlign = FormFieldPropLabelAlign;

export type DateInputProps<T extends DateValue> = {
  /** Inline styles. */
  style?: CSSProperties;
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** The helper text content. */
  caption?: ReactNode;
  /**
   * The variant to use.
   * @default 'filled'
   */
  variant?: DateInputPropVariant;
  /**
   * If true, the input will take up the full width of its container.
   */
  fullWidth?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: FormFieldProps;
    label?: FormFieldLabelProps;
    group?: FormFieldControlGroupProps;
    caption?: FormFieldCaptionProps;
    inputDate?: FormFieldInputDateProps;
    errorMessage?: FormFieldErrorProps;
  };
  /** Ref to the control */
  ref?: Ref<HTMLDivElement>;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   */
  isLabelHidden?: boolean;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: DateInputPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: DateInputPropLabelAlign;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
} & Omit<AriaDateFieldProps<T>, 'description' | 'validationState'>;

export type DateInputComponent = <T extends DateValue>(
  props: DateInputProps<T>
) => ReactElement | null;

export type DateInputRef = ComponentRef<'div'>;
