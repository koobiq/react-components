import { useRef } from 'react';

import { clsx, useHover, mergeProps } from '@koobiq/react-core';
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
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isPressed,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const { hoverProps, isHovered } = useHover({ isDisabled });

  return (
    <td {...cellProps}>
      <div
        {...mergeProps(hoverProps, buttonProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={clsx(
          s.cell,
          isHovered && s.hovered,
          isSelected && s.selected,
          isSelected && textNormalMedium,
          isToday && s.today,
          isDisabled && s.disabled,
          isPressed && s.pressed,
          isUnavailable && s.unavailable
        )}
      >
        {formattedDate}
      </div>
    </td>
  );
}
