import { useRef } from 'react';

import { IconCalendarO16 } from '@koobiq/react-icons';
import type { AriaDatePickerProps, DateValue } from '@koobiq/react-primitives';
import { useDatePicker, useDatePickerState } from '@koobiq/react-primitives';

import { Calendar } from '../Calendar';
import { DateInput } from '../DateInput';
import { IconButton } from '../IconButton';
import { PopoverInner } from '../Popover/PopoverInner';

export type DatePickerProps<T extends DateValue> = AriaDatePickerProps<T>;

export function DatePicker<T extends DateValue>(props: DatePickerProps<T>) {
  const state = useDatePickerState(props);
  const ref = useRef(null);

  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    // dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div {...labelProps}></div>
      <div {...groupProps} ref={ref} style={{ display: 'flex' }}>
        <DateInput
          label={props.label}
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
