import { forwardRef } from 'react';
import type { Ref } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
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
import type {
  CalendarComponentProp,
  CalendarProps,
  CalendarRef,
} from './types';

const textNormal = utilClasses.typography['text-normal'];

function CalendarRender<T extends DateValue>(
  props: CalendarProps<T>,
  ref: Ref<CalendarRef>
) {
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

  const rootProps = mergeProps(
    { className: clsx(s.base, textNormal), ref },
    calendarProps
  );

  return (
    <div {...rootProps}>
      <CalendarHeader
        state={state}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <CalendarGrid state={state} firstDayOfWeek={props.firstDayOfWeek} />
    </div>
  );
}

export const Calendar = forwardRef(CalendarRender) as CalendarComponentProp;
