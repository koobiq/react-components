import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { AriaTimeFieldProps, TimeValue } from '@koobiq/react-primitives';

import type { DateInputPropVariant } from '../DateInput';
import {
  type FormFieldLabelProps,
  type FormFieldCaptionProps,
  type FormFieldErrorProps,
  type FormFieldInputDateProps,
  type FormFieldControlGroupProps,
  type FormFieldProps,
  type FormFieldPropLabelAlign,
  formFieldPropLabelAlign,
  type FormFieldPropLabelPlacement,
  formFieldPropLabelPlacement,
} from '../FormField';

export const timePickerPropLabelPlacement = formFieldPropLabelPlacement;
export type TimePickerPropLabelPlacement = FormFieldPropLabelPlacement;
export const timePickerPropLabelAlign = formFieldPropLabelAlign;
export type TimePickerPropLabelAlign = FormFieldPropLabelAlign;

export type TimePickerProps<T extends TimeValue> = {
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
  labelPlacement?: TimePickerPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: TimePickerPropLabelAlign;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
} & AriaTimeFieldProps<T>;

export type TimePickerComponent = <T extends TimeValue>(
  props: TimePickerProps<T>
) => ReactElement | null;

export type TimePickerRef = ComponentRef<'div'>;
