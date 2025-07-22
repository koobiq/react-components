'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import {
  clsx,
  mergeProps,
  useLocale,
  createCalendar,
} from '@koobiq/react-core';
import {
  useCalendar,
  useCalendarState,
  type DateValue,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import s from './Calendar.module.css';
import { CalendarGrid, CalendarHeader } from './components';
import type { CalendarComponent, CalendarProps, CalendarRef } from './types';

const textNormal = utilClasses.typography['text-normal'];

function CalendarRender<T extends DateValue>(
  props: CalendarProps<T>,
  ref: Ref<CalendarRef>
) {
  const { style, className } = props;
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
    { className: clsx(s.base, textNormal, className), style, ref },
    calendarProps
  );

  return (
    <div {...rootProps}>
      <CalendarHeader
        state={state}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <CalendarGrid state={state} />
    </div>
  );
}

export const Calendar = forwardRef(CalendarRender) as CalendarComponent;
