'use client';

import { forwardRef, useRef } from 'react';
import type { Ref } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { IconCalendarO16 } from '@koobiq/react-icons';
import { type DateValue, removeDataAttributes } from '@koobiq/react-primitives';
import { useDatePicker, useDatePickerState } from '@koobiq/react-primitives';

import { Calendar } from '../Calendar';
import { DateInput } from '../DateInput';
import { useForm } from '../Form';
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
    labelPlacement,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    labelAlign,
    startAddon,
    endAddon,
    'data-testid': testId,
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

  const state = useDatePickerState(
    removeDataAttributes({
      ...props,
      isDisabled,
      isReadOnly,
      description: caption,
    })
  );

  const {
    isInvalid,
    groupProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps: calendarPropsAria,
  } = useDatePicker(
    removeDataAttributes({
      ...props,
      isDisabled,
      isReadOnly,
      description: caption,
    }),
    state,
    anchorRef
  );

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { slotProps: rootSlotProps, ...otherRoot } = slotProps?.root || {};

  const mergedRootSlotProps = {
    ...rootSlotProps,
    group: mergeProps(rootSlotProps?.group, groupProps, {
      ref: anchorRef,
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
    }),
  };

  const rootProps = mergeProps(
    {
      ref,
      style,
      label,
      caption,
      fullWidth,
      className,
      startAddon,
      labelPlacement,
      labelAlign,
      errorMessage,
      'data-testid': testId,
      slotProps: mergedRootSlotProps,
    },
    otherRoot,
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
      className: s.popover,
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
