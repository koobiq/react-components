'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { createCalendar } from '@internationalized/date';
import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import {
  useDateField,
  useDateFieldState,
  removeDataAttributes,
} from '@koobiq/react-primitives';
import type { DateValue } from '@koobiq/react-primitives';

import {
  FieldCaption,
  FieldControl,
  FieldError,
  FieldInputDate,
  FieldInputGroup,
  FieldLabel,
} from '../FieldComponents';
import type {
  FieldCaptionProps,
  FieldControlProps,
  FieldErrorProps,
  FieldInputDateProps,
  FieldInputGroupProps,
  FieldLabelProps,
} from '../FieldComponents';

import { DateInputSegment } from './components';
import s from './DateInput.module.css';
import type { DateInputRef, DateInputProps, DateInputComponent } from './types';

export function DateInputRender<T extends DateValue>(
  props: Omit<DateInputProps<T>, 'ref'>,
  ref: Ref<DateInputRef>
) {
  const { errorMessage } = props;
  const { locale } = useLocale();

  const {
    variant = 'filled',
    slotProps,
    caption,
    startAddon,
    endAddon,
    isLabelHidden,
    label,
    className,
    style,
    fullWidth,
    isReadOnly,
    'data-testid': testId,
  } = props;

  const state = useDateFieldState({
    ...removeDataAttributes(props),
    locale,
    createCalendar,
  });

  const domRef = useDOMRef(ref);

  const {
    labelProps: labelPropReactAria,
    fieldProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useDateField({ ...removeDataAttributes(props) }, state, domRef);

  const { isInvalid, isRequired, isDisabled } = state;

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

  const labelProps = mergeProps<
    [FieldLabelProps, FieldLabelProps, FieldLabelProps | undefined]
  >(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropReactAria,
    slotProps?.label
  );

  const groupProps = mergeProps<
    [FieldInputGroupProps, FieldInputGroupProps | undefined]
  >(
    {
      endAddon,
      isInvalid,
      isDisabled,
      startAddon,
    },
    slotProps?.group
  );

  const captionProps = mergeProps<
    [FieldCaptionProps, FieldCaptionProps | undefined, FieldCaptionProps]
  >({ children: caption }, slotProps?.caption, descriptionProps);

  const errorProps = mergeProps<
    [FieldErrorProps, FieldErrorProps | undefined, FieldErrorProps]
  >(
    {
      isInvalid,
      children:
        typeof errorMessage === 'function'
          ? errorMessage({ ...validation })
          : errorMessage,
    },
    slotProps?.errorMessage,
    errorMessageProps
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
      <FieldCaption {...captionProps} />
      <FieldError {...errorProps} />
    </FieldControl>
  );
}

export const DateInput = forwardRef(DateInputRender) as DateInputComponent;
