'use client';

import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconCalendarO16 } from '@koobiq/react-icons';
import type { DateValue } from '@koobiq/react-primitives';
import { useDatePicker, useDatePickerState } from '@koobiq/react-primitives';

import { Calendar } from '../Calendar';
import { DateInput } from '../DateInput';
import { IconButton } from '../IconButton';
import { PopoverInner } from '../Popover/PopoverInner';

import s from './DatePicker.module.css';
import type { DatePickerProps } from './types';

export function DatePicker<T extends DateValue>(props: DatePickerProps<T>) {
  const state = useDatePickerState(props);
  const ref = useRef(null);

  const { label } = props;

  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    // dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref);

  return (
    <div className={clsx(s.base)}>
      <div {...labelProps}></div>
      <div {...groupProps} ref={ref} className={s.group}>
        <DateInput
          label={label}
          slotProps={{
            label: labelProps,
            group: {
              endAddon: (
                <IconButton
                  variant="fade-contrast"
                  style={{ marginInlineEnd: '-4px' }}
                  {...buttonProps}
                >
                  <IconCalendarO16 />
                </IconButton>
              ),
            },
          }}
          {...fieldProps}
        />
      </div>
      <PopoverInner
        offset={4}
        size="auto"
        state={state}
        anchorRef={ref}
        placement="bottom start"
        hideCloseButton
        hideArrow
      >
        <Calendar {...calendarProps} firstDayOfWeek={props.firstDayOfWeek} />
      </PopoverInner>
    </div>
  );
}
