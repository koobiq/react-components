'use client';

import { createRef, type RefObject, useEffect, useMemo, useRef } from 'react';

import { clsx, useLocale, getWeeksInMonth } from '@koobiq/react-core';
import {
  useCalendarGrid,
  type CalendarState,
  type AriaCalendarGridProps,
} from '@koobiq/react-primitives';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { utilClasses } from '../../../../styles/utility';
import { CalendarCell } from '../CalendarCell';

import s from './CalendarGrid.module.css';
import { monthIndex } from './utils';

const textNormal = utilClasses.typography['text-normal'];

type Dir = 'next' | 'prev' | 'jump';

type CalendarGridProps = {
  state: CalendarState;
} & AriaCalendarGridProps;

export function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { locale } = useLocale();

  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { ...props, weekdayStyle: 'short' },
    state
  );

  const currentKey = useMemo(
    () => state.visibleRange.start.toString(),
    [state.visibleRange.start]
  );

  // Determine animation mode: next/prev for adjacent months, jump for skips > 1 month
  const prevStartRef = useRef(state.visibleRange.start);

  const dir: Dir = useMemo(() => {
    const curr = state.visibleRange.start;
    const prev = prevStartRef.current;

    const delta = monthIndex(curr) - monthIndex(prev);

    if (delta === 0) return 'next';
    if (Math.abs(delta) > 1) return 'jump';

    return delta > 0 ? 'next' : 'prev';
  }, [state.visibleRange.start]);

  useEffect(() => {
    prevStartRef.current = state.visibleRange.start;
  }, [state.visibleRange.start]);

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  // Unique nodeRef per key to avoid findDOMNode and animate enter/exit correctly
  const nodeRefs = useRef(
    new Map<string, RefObject<HTMLTableSectionElement | null>>()
  );

  const k = currentKey;

  if (!nodeRefs.current.has(k)) {
    nodeRefs.current.set(k, createRef<HTMLTableSectionElement | null>());
  }

  const tbodyRef = nodeRefs.current.get(k)!;

  return (
    <div className={s.container}>
      <table {...gridProps} className={clsx(s.base, s[dir], textNormal)}>
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
        <TransitionGroup component={null}>
          <CSSTransition
            key={k}
            timeout={300}
            nodeRef={tbodyRef}
            classNames={{
              enter: s.daysEnter,
              enterActive: s.daysEnterActive,
              exit: s.daysExit,
              exitActive: s.daysExitActive,
            }}
            onExited={() => {
              nodeRefs.current.delete(k);
            }}
          >
            <tbody ref={tbodyRef}>
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
          </CSSTransition>
        </TransitionGroup>
      </table>
    </div>
  );
}
