import type { ComponentRef, ReactElement, Ref } from 'react';

import type { AriaCalendarProps, DateValue } from '@koobiq/react-primitives';

export type CalendarProps<T extends DateValue> = AriaCalendarProps<T> & {
  /** Ref to the root container. */
  ref?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
};

export type CalendarComponentProp = <T extends DateValue>(
  props: CalendarProps<T>
) => ReactElement | null;

export type CalendarRef = ComponentRef<'div'>;
