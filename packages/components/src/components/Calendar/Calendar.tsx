import { clsx } from '@koobiq/react-core';
import {
  useLocale,
  useCalendar,
  createCalendar,
  useCalendarState,
} from '@koobiq/react-primitives';
import type { DateValue } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import s from './Calendar.module.css';
import { CalendarGrid, CalendarHeader } from './components';
import type { CalendarProps } from './types';

const textNormal = utilClasses.typography['text-normal'];

// https://codesandbox.io/p/sandbox/affectionate-rosalind-tdm323?file=%2Fsrc%2FCalendar.js%3A40%2C10
export function Calendar(props: CalendarProps<DateValue>) {
  const { locale } = useLocale();

  const state = useCalendarState({
    createCalendar,
    ...props,
    locale,
  });

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  return (
    <div {...calendarProps} className={clsx(s.base, textNormal)}>
      <CalendarHeader
        state={state}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <CalendarGrid state={state} firstDayOfWeek={props.firstDayOfWeek} />
    </div>
  );
}
