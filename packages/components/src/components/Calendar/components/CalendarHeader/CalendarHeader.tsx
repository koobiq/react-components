'use client';

import { today, useLocalizedStringFormatter } from '@koobiq/react-core';
import {
  IconChevronLeft16,
  IconChevronRight16,
  IconCircleXs16,
} from '@koobiq/react-icons';
import type { CalendarState, CalendarAria } from '@koobiq/react-primitives';

import { Button } from '../../../Button';
import intlMessages from '../../intl.json';
import { CalendarMonthDropdown } from '../CalendarMonthDropdown';
import { CalendarYearDropdown } from '../CalendarYearDropdown';

import s from './CalendarHeader.module.css';

type CalendarHeaderProps = {
  prevButtonProps: CalendarAria['prevButtonProps'];
  nextButtonProps: CalendarAria['nextButtonProps'];
  state: CalendarState;
};

export const CalendarHeader = (props: CalendarHeaderProps) => {
  const { prevButtonProps, nextButtonProps, state } = props;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={s.base}>
      <CalendarMonthDropdown state={state} />
      <CalendarYearDropdown state={state} />
      <div className={s.actions}>
        <Button
          {...prevButtonProps}
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
          isDisabled={state.isDisabled}
          variant="contrast-transparent"
          startIcon={<IconCircleXs16 />}
          onlyIcon
        />
        <Button
          {...nextButtonProps}
          variant="contrast-transparent"
          startIcon={<IconChevronRight16 />}
          onlyIcon
        />
      </div>
    </div>
  );
};
