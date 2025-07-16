import type { CSSProperties, ReactElement, ReactNode } from 'react';

import type { AriaDatePickerProps, DateValue } from '@koobiq/react-primitives';

import type { DateInputRef } from '../DateInput';

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
} & Omit<AriaDatePickerProps<T>, 'description'>;

export type DatePickerComponent = <T extends DateValue>(
  props: DatePickerProps<T>
) => ReactElement | null;

export type DatePickerRef = DateInputRef;
