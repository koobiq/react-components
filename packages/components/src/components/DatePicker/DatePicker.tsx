'use client';

import { forwardRef, useRef } from 'react';
import type { Ref } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { IconCalendarO16 } from '@koobiq/react-icons';
import { type DateValue, removeDataAttributes } from '@koobiq/react-primitives';
import { useDatePicker, useDatePickerState } from '@koobiq/react-primitives';

import { Calendar } from '../Calendar';
import { DateInput } from '../DateInput';
import { IconButton } from '../IconButton';
import { PopoverInner } from '../Popover/PopoverInner';

import s from './DatePicker.module.css';
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

  const {
    label,
    style,
    caption,
    className,
    slotProps,
    fullWidth,
    errorMessage,
    startAddon,
    endAddon,
    'data-testid': testId,
  } = props;

  const state = useDatePickerState(
    removeDataAttributes({ ...props, description: caption })
  );

  const {
    isInvalid,
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps: calendarPropsAria,
  } = useDatePicker(
    removeDataAttributes({ ...props, description: caption }),
    state,
    anchorRef
  );

  const rootProps = mergeProps(
    {
      ref,
      style,
      label,
      caption,
      fullWidth,
      className,
      startAddon,
      errorMessage,
      'data-testid': testId,
      slotProps: {
        label: labelProps,
        group: {
          endAddon: (
            <>
              {endAddon}
              <IconButton
                variant={isInvalid ? 'error' : 'fade-contrast'}
                className={s.calendar}
                {...buttonProps}
              >
                <IconCalendarO16 />
              </IconButton>
            </>
          ),
          ...groupProps,
          ref: anchorRef,
        },
      },
    },
    slotProps?.root,
    fieldProps
  );

  const popoverProps = mergeProps(
    {
      state,
      anchorRef,
      offset: 4,
      size: 'auto',
      hideArrow: true,
      hideCloseButton: true,
      placement: 'bottom start',
      slotProps: {
        dialog: dialogProps,
      },
    },
    slotProps?.popover
  );

  const calendarProps = mergeProps(calendarPropsAria, slotProps?.calendar);

  return (
    <>
      <DateInput {...rootProps} />
      <PopoverInner {...popoverProps}>
        <Calendar firstDayOfWeek={props.firstDayOfWeek} {...calendarProps} />
      </PopoverInner>
    </>
  );
}

export const DatePicker = forwardRef(DatePickerRender) as DatePickerComponent;
