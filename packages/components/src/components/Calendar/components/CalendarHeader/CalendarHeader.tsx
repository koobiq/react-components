'use client';

import {
  mergeProps,
  today,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  IconChevronLeft16,
  IconChevronRight16,
  IconCircleXs16,
} from '@koobiq/react-icons';

import { Button } from '../../../Button';
import intlMessages from '../../intl.json';
import { CalendarMonthDropdown } from '../CalendarMonthDropdown';
import { CalendarYearDropdown } from '../CalendarYearDropdown';

import s from './CalendarHeader.module.css';
import type { CalendarHeaderProps } from './types';

export const CalendarHeader = (props: CalendarHeaderProps) => {
  const { prevButtonProps, nextButtonProps, state, slotProps } = props;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const rootProps = mergeProps({ className: s.base }, slotProps?.root);
  const actionsProps = mergeProps({ className: s.actions }, slotProps?.actions);
  const monthDropdown = mergeProps({ state }, slotProps?.['month-picker']);
  const yearDropdown = mergeProps({ state }, slotProps?.['year-picker']);

  return (
    <div {...rootProps}>
      <CalendarMonthDropdown {...monthDropdown} />
      <CalendarYearDropdown {...yearDropdown} />
      <div {...actionsProps}>
        <Button
          {...prevButtonProps}
          data-slot="prev-period"
          variant="contrast-transparent"
          startIcon={<IconChevronLeft16 />}
          onlyIcon
        />
        <Button
          aria-label={stringFormatter.format('today')}
          onPress={() => {
            const date = today(state.timeZone);
            state.setFocusedDate(date);
          }}
          data-slot="today"
          isDisabled={state.isDisabled}
          variant="contrast-transparent"
          startIcon={<IconCircleXs16 />}
          onlyIcon
        />
        <Button
          {...nextButtonProps}
          data-slot="next-period"
          variant="contrast-transparent"
          startIcon={<IconChevronRight16 />}
          onlyIcon
        />
      </div>
    </div>
  );
};
