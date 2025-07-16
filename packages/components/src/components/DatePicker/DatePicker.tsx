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
  const anchorRef = useRef(null);

  const { label, fullWidth, caption, errorMessage } = props;

  const state = useDatePickerState({ ...props, description: caption });

  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
    isInvalid,
  } = useDatePicker({ ...props, description: caption }, state, anchorRef);

  return (
    <>
      <DateInput
        ref={ref}
        label={label}
        caption={caption}
        fullWidth={fullWidth}
        errorMessage={errorMessage}
        slotProps={{
          label: labelProps,
          group: {
            endAddon: (
              <IconButton
                variant={isInvalid ? 'error' : 'fade-contrast'}
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
        slotProps={{
          dialog: dialogProps,
        }}
        hideCloseButton
        hideArrow
      >
        <Calendar {...calendarProps} firstDayOfWeek={props.firstDayOfWeek} />
      </PopoverInner>
    </>
  );
}

export const DatePicker = forwardRef(DatePickerRender) as DatePickerComponent;
