import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { AriaDateFieldProps, DateValue } from '@koobiq/react-primitives';

import {
  type FieldCaptionProps,
  type FieldErrorProps,
  type FieldInputDateProps,
  type FieldContentGroupProps,
  fieldContentGroupPropVariant,
  type FieldContentGroupPropVariant,
} from '../FieldComponents';
import {
  type FormControlProps,
  type FormControlPropLabelAlign,
  formControlPropLabelAlign,
  type FormControlPropLabelPlacement,
  formControlPropLabelPlacement,
} from '../FormControl';
import type { FormControlLabelProps } from '../FormControlLabel';

export const dateInputPropVariant = fieldContentGroupPropVariant;

export type DateInputPropVariant = FieldContentGroupPropVariant;

export const dateInputPropLabelPlacement = formControlPropLabelPlacement;
export type DateInputPropLabelPlacement = FormControlPropLabelPlacement;
export const dateInputPropLabelAlign = formControlPropLabelAlign;
export type DateInputPropLabelAlign = FormControlPropLabelAlign;

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
    root?: FormControlProps;
    label?: FormControlLabelProps;
    group?: FieldContentGroupProps;
    caption?: FieldCaptionProps;
    inputDate?: FieldInputDateProps;
    errorMessage?: FieldErrorProps;
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
