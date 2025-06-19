'use client';

import { useRef } from 'react';

import { clsx, useHover, mergeProps, useFocusRing } from '@koobiq/react-core';
import { today, useCalendarCell } from '@koobiq/react-primitives';
import type {
  CalendarState,
  AriaCalendarCellProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import s from '../../Calendar.module.css';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

type CalendarCellProps = {
  state: CalendarState;
  date: AriaCalendarCellProps['date'];
};

export function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = useRef(null);

  const isToday = date.compare(today(state.timeZone)) === 0;

  const {
    cellProps,
    isSelected,
    isDisabled,
    isPressed,
    buttonProps,
    isUnavailable,
    formattedDate,
    isOutsideVisibleRange,
  } = useCalendarCell({ date }, state, ref);

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { focusProps, isFocusVisible } = useFocusRing({});

  return (
    <td {...cellProps}>
      <div
        {...mergeProps(hoverProps, focusProps, buttonProps)}
        ref={ref}
        className={clsx(
          s.cell,
          isToday && s.today,
          isPressed && s.pressed,
          isHovered && s.hovered,
          isDisabled && s.disabled,
          isSelected && s.selected,
          isUnavailable && s.unavailable,
          isSelected && textNormalMedium,
          isFocusVisible && s.focusVisible
        )}
        hidden={isOutsideVisibleRange}
      >
        {formattedDate}
      </div>
    </td>
  );
}
