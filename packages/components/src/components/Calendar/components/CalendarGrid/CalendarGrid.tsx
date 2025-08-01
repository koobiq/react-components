'use client';

import { clsx, useLocale, getWeeksInMonth } from '@koobiq/react-core';
import {
  useCalendarGrid,
  type CalendarState,
  type AriaCalendarGridProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { CalendarCell } from '../CalendarCell';

import s from './CalendarGrid.module.css';

const textNormal = utilClasses.typography['text-normal'];

type CalendarGridProps = {
  state: CalendarState;
} & AriaCalendarGridProps;

export function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { locale } = useLocale();

  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { ...props, weekdayStyle: 'short' },
    state
  );

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps} className={clsx(s.base, textNormal)}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, i) => (
            <th className={clsx(s.weekDay, textNormal)} key={i}>
              {day}
            </th>
          ))}
        </tr>
        <tr>
          <th colSpan={7} className={s.divider} />
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
