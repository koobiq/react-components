import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { AriaTimeFieldProps, TimeValue } from '@koobiq/react-primitives';

import type { DateInputPropVariant } from '../DateInput';
import type {
  FieldCaptionProps,
  FieldControlProps,
  FieldErrorProps,
  FieldInputDateProps,
  FieldContentGroupProps,
  FieldLabelProps,
} from '../FieldComponents';

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
   * @default false
   */
  fullWidth?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: FieldControlProps;
    label?: FieldLabelProps;
    group?: FieldContentGroupProps;
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
} & AriaTimeFieldProps<T>;

export type TimePickerComponent = <T extends TimeValue>(
  props: TimePickerProps<T>
) => ReactElement | null;

export type TimePickerRef = ComponentRef<'div'>;
