import { forwardRef, type Ref } from 'react';

import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import { IconClock16 } from '@koobiq/react-icons';
import {
  useTimeFieldState,
  useTimeField,
  type TimeValue,
} from '@koobiq/react-primitives';

import { DateInputSegment } from '../DateInput/components';
import s from '../DateInput/DateInput.module.css';
import {
  FieldControl,
  type FieldControlProps,
  FieldInputDate,
  type FieldInputDateProps,
  FieldInputGroup,
  type FieldInputGroupProps,
  FieldLabel,
  type FieldLabelProps,
} from '../FieldComponents';

import type {
  TimePickerComponent,
  TimePickerProps,
  TimePickerRef,
} from './types';

export function TimePickerRender<T extends TimeValue>(
  props: Omit<TimePickerProps<T>, 'ref'>,
  ref: Ref<TimePickerRef>
) {
  const { locale } = useLocale();

  const domRef = useDOMRef(ref);

  const {
    isLabelHidden,
    label,
    isRequired,
    slotProps,
    style,
    fullWidth,
    variant,
    isInvalid,
    isDisabled,
    isReadOnly,
    className,
    endAddon,
    startAddon,
    'data-testid': testId,
  } = props;

  const state = useTimeFieldState({
    ...props,
    locale,
  });

  const { labelProps: labelPropReactAria, fieldProps } = useTimeField(
    props,
    state,
    domRef
  );

  const rootProps = mergeProps<
    [FieldControlProps, FieldControlProps | undefined]
  >(
    {
      style,
      fullWidth,
      'data-testid': testId,
      'data-variant': variant,
      'data-invalid': isInvalid,
      'data-disabled': isDisabled,
      'data-fullwidth': fullWidth,
      'data-required': isRequired,
      'data-readonly': isReadOnly,
      className: clsx(s.base, className),
    },
    slotProps?.root
  );

  const groupProps = mergeProps<
    [FieldInputGroupProps, FieldInputGroupProps | undefined]
  >(
    {
      startAddon: (
        <>
          {startAddon}
          <IconClock16 />
        </>
      ),
      isInvalid,
      isDisabled,
      endAddon,
    },
    slotProps?.group
  );

  const controlProps = mergeProps<
    [FieldInputDateProps, FieldInputDateProps | undefined, FieldInputDateProps]
  >(
    {
      variant,
      isInvalid,
      isDisabled,
      ref: domRef,
    },
    slotProps?.inputDate,
    fieldProps
  );

  const labelProps = mergeProps<
    [FieldLabelProps, FieldLabelProps, FieldLabelProps | undefined]
  >(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropReactAria,
    slotProps?.label
  );

  return (
    <FieldControl {...rootProps}>
      <FieldLabel {...labelProps} />
      <FieldInputGroup {...groupProps}>
        <FieldInputDate {...controlProps}>
          {state.segments.map((segment, i) => (
            <DateInputSegment key={i} segment={segment} state={state} />
          ))}
        </FieldInputDate>
      </FieldInputGroup>
    </FieldControl>
  );
}

export const TimePicker = forwardRef(TimePickerRender) as TimePickerComponent;
