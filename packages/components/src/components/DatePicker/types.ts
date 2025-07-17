import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { AriaDatePickerProps, DateValue } from '@koobiq/react-primitives';

import type { CalendarProps } from '../Calendar';
import type { DateInputProps, DateInputRef } from '../DateInput';
import type { PopoverProps } from '../Popover';

export type DatePickerProps<T extends DateValue> = {
  /**
   * If true, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /** The helper text content. */
  caption?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the DateInput. */
  ref?: Ref<DateInputRef>;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: DateInputProps<T>;
    popover?: PopoverProps;
    calendar?: CalendarProps<T>;
  };
} & Omit<
  AriaDatePickerProps<T>,
  'description' | 'validate' | 'validationBehavior' | 'validationState'
>;

export type DatePickerComponent = <T extends DateValue>(
  props: DatePickerProps<T>
) => ReactElement | null;

export type DatePickerRef = DateInputRef;
