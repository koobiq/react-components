import type { ComponentPropsWithRef } from 'react';

import type { CalendarAria, CalendarState } from '@koobiq/react-primitives';

import type { CalendarMonthDropdownProps } from '../CalendarMonthDropdown';
import type { CalendarYearDropdownProps } from '../CalendarYearDropdown';

export type CalendarHeaderProps = {
  prevButtonProps: CalendarAria['prevButtonProps'];
  nextButtonProps: CalendarAria['nextButtonProps'];
  state: CalendarState;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
    actions?: ComponentPropsWithRef<'div'>;
    'month-picker'?: Partial<CalendarMonthDropdownProps>;
    'year-picker'?: Partial<CalendarYearDropdownProps>;
  };
};
