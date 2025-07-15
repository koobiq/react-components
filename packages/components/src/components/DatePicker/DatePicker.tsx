'use client';

import { forwardRef, useRef } from 'react';
import type { Ref } from 'react';

import { IconCalendarO16 } from '@koobiq/react-icons';
import type { DateValue } from '@koobiq/react-primitives';
import { useDatePicker, useDatePickerState } from '@koobiq/react-primitives';

import { Calendar } from '../Calendar';
import { DateInput } from '../DateInput';
import { IconButton } from '../IconButton';
import { PopoverInner } from '../Popover/PopoverInner';

import type {
  DatePickerComponent,
  DatePickerProps,
  DatePickerRef,
} from './types';

export function DatePickerRender<T extends DateValue>(
  props: DatePickerProps<T>,
  ref: Ref<DatePickerRef>
) {
  const state = useDatePickerState(props);
  const anchorRef = useRef(null);

  const { label } = props;

  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    // dialogProps,
    calendarProps,
  } = useDatePicker(props, state, anchorRef);

  return (
    <>
      <DateInput
        ref={ref}
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
            ...groupProps,
            ref: anchorRef,
          },
        }}
        {...fieldProps}
      />
      <PopoverInner
        offset={4}
        size="auto"
        state={state}
        anchorRef={anchorRef}
        placement="bottom start"
        hideCloseButton
        hideArrow
      >
        <Calendar {...calendarProps} firstDayOfWeek={props.firstDayOfWeek} />
      </PopoverInner>
    </>
  );
}

export const DatePicker = forwardRef(DatePickerRender) as DatePickerComponent;
