import type { ReactElement } from 'react';

import type { AriaDatePickerProps, DateValue } from '@koobiq/react-primitives';

import type { DateInputRef } from '../DateInput';

export type DatePickerProps<T extends DateValue> = {
  /**
   * If true, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
} & AriaDatePickerProps<T>;

export type DatePickerComponent = <T extends DateValue>(
  props: DatePickerProps<T>
) => ReactElement | null;

export type DatePickerRef = DateInputRef;
