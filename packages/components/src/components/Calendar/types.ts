import type { ComponentRef, ReactElement } from 'react';

import type { AriaCalendarProps, DateValue } from '@koobiq/react-primitives';

export type CalendarProps<T extends DateValue = DateValue> =
  AriaCalendarProps<T>;

export type CalendarComponentProp = <T extends DateValue = DateValue>(
  props: CalendarProps<T>
) => ReactElement | null;

export type CalendarRef = ComponentRef<'div'>;
