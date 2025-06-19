'use client';

import {
  IconChevronLeft16,
  IconChevronRight16,
  IconCircleXs16,
} from '@koobiq/react-icons';
import { today } from '@koobiq/react-primitives';

import { Button } from '../../../Button';
import s from '../../Calendar.module.css';
import { CalendarMonthDropdown } from '../CalendarMonthDropdown';
import { CalendarYearDropdown } from '../CalendarYearDropdown';

type CalendarHeaderProps = {
  prevButtonProps: any;
  nextButtonProps: any;
  state: any;
};

export const CalendarHeader = (props: CalendarHeaderProps) => {
  const { prevButtonProps, nextButtonProps, state } = props;

  return (
    <div className={s.header}>
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
