import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { AriaDateFieldProps, DateValue } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldControlProps,
  FieldErrorProps,
  FieldInputDateProps,
  FieldInputGroupProps,
  FieldLabelProps,
} from '../FieldComponents';

export const dateInputPropVariant = ['filled', 'transparent'] as const;

export type DateInputPropVariant = (typeof dateInputPropVariant)[number];

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
   * @default filled
   */
  variant?: DateInputPropVariant;
  /**
   * If true, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: FieldControlProps;
    label?: FieldLabelProps;
    group?: FieldInputGroupProps;
    caption?: FieldCaptionProps;
    inputDate?: FieldInputDateProps;
    errorMessage?: FieldErrorProps;
  };
  /** Ref to the control */
  ref?: Ref<HTMLDivElement>;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   */
  isLabelHidden?: boolean;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
} & Omit<
  AriaDateFieldProps<T>,
  'description' | 'validationBehavior' | 'validate' | 'validationState'
>;

export type DateInputComponent = <T extends DateValue>(
  props: DateInputProps<T>
) => ReactElement | null;

export type DateInputRef = ComponentRef<'div'>;
