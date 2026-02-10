import type { ComponentPropsWithRef } from 'react';

import type {
  AriaCalendarGridProps,
  CalendarState,
} from '@koobiq/react-primitives';

export type CalendarGridProps = {
  state: CalendarState;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
    table?: ComponentPropsWithRef<'table'>;
  };
} & AriaCalendarGridProps;
