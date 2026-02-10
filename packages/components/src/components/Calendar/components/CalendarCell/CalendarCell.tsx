'use client';

import { useRef } from 'react';

import {
  clsx,
  useHover,
  mergeProps,
  useFocusRing,
  today,
} from '@koobiq/react-core';
import { useCalendarCell } from '@koobiq/react-primitives';
import type {
  CalendarState,
  AriaCalendarCellProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

import s from './CalendarCell.module.css';

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
    isInvalid,
    isPressed,
    buttonProps,
    isUnavailable,
    formattedDate,
    isOutsideVisibleRange,
  } = useCalendarCell({ date }, state, ref);

  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || isUnavailable,
  });

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({});

  return (
    <td {...cellProps}>
      <div
        {...mergeProps(hoverProps, focusProps, buttonProps)}
        ref={ref}
        data-slot="calendar-cell"
        data-today={isToday || undefined}
        data-focused={isFocused || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={isHovered || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={isDisabled || undefined}
        data-selected={isSelected || undefined}
        data-unavailable={isUnavailable || undefined}
        data-focus-visible={isFocusVisible || undefined}
        className={clsx(
          s.base,
          isToday && s.today,
          isPressed && s.pressed,
          isHovered && s.hovered,
          isDisabled && s.disabled,
          isSelected && s.selected,
          isInvalid && s.invalid,
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
