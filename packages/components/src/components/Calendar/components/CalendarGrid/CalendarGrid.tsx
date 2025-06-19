'use client';

import { clsx } from '@koobiq/react-core';
import type {
  AriaCalendarGridProps,
  CalendarState,
} from '@koobiq/react-primitives';
import { useCalendarGrid } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import s from '../../Calendar.module.css';
import { CalendarCell } from '../CalendarCell';

const textNormal = utilClasses.typography['text-normal'];

type CalendarGridProps = {
  state: CalendarState;
} & AriaCalendarGridProps;

export function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    { ...props, weekdayStyle: 'short' },
    state
  );

  return (
    <table {...gridProps} className={clsx(s.table, textNormal)}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th className={clsx(s.weekDay, textNormal)} key={index}>
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
