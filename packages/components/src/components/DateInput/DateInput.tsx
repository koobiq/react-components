'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { createCalendar } from '@internationalized/date';
import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import {
  useDateField,
  useDateFieldState,
  removeDataAttributes,
  FieldErrorContext,
} from '@koobiq/react-primitives';
import type { DateValue } from '@koobiq/react-primitives';

import { DateSegment } from '../DateSegment';
import {
  FieldCaption,
  FieldError,
  FieldInputDate,
  FieldContentGroup,
  Field,
} from '../FieldComponents';
import type {
  FieldCaptionProps,
  FieldErrorProps,
  FieldInputDateProps,
  FieldContentGroupProps,
} from '../FieldComponents';
import { FormControl, type FormControlProps } from '../FormControl';
import {
  FormControlLabel,
  type FormControlLabelProps,
} from '../FormControlLabel';

import s from './DateInput.module.css';
import type { DateInputRef, DateInputProps, DateInputComponent } from './types';

export function DateInputRender<T extends DateValue>(
  props: Omit<DateInputProps<T>, 'ref'>,
  ref: Ref<DateInputRef>
) {
  const { locale } = useLocale();

  const {
    variant = 'filled',
    slotProps,
    caption,
    startAddon,
    errorMessage,
    endAddon,
    isLabelHidden,
    labelPlacement,
    labelAlign,
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
    inputProps,
    ...validation
  } = useDateField({ ...removeDataAttributes(props) }, state, domRef);

  const { isRequired, isDisabled } = state;

  const { isInvalid } = validation;

  const rootProps = mergeProps<
    [FormControlProps, FormControlProps | undefined]
  >(
    {
      style,
      fullWidth,
      labelPlacement,
      labelAlign,
      'data-testid': testId,
      'data-variant': variant,
      'data-invalid': isInvalid,
      'data-disabled': isDisabled,
      'data-required': isRequired,
      'data-readonly': isReadOnly,
      className: clsx(s.base, className),
    },
    slotProps?.root
  );

  const labelProps = mergeProps<
    [
      FormControlLabelProps,
      FormControlLabelProps,
      FormControlLabelProps | undefined,
    ]
  >(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropReactAria,
    slotProps?.label
  );

  const groupProps = mergeProps<
    [FieldContentGroupProps, FieldContentGroupProps | undefined]
  >(
    {
      endAddon,
      isInvalid,
      isDisabled,
      startAddon,
      variant,
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
      children: errorMessage,
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
    <FormControl {...rootProps}>
      <FormControlLabel {...labelProps} />
      <Field>
        <FieldContentGroup {...groupProps}>
          <FieldInputDate {...controlProps}>
            {state.segments.map((segment, i) => (
              <DateSegment key={i} segment={segment} state={state} />
            ))}
            <input {...inputProps} />
          </FieldInputDate>
        </FieldContentGroup>
        <FieldCaption {...captionProps} />
        <FieldErrorContext.Provider value={validation}>
          <FieldError {...errorProps} />
        </FieldErrorContext.Provider>
      </Field>
    </FormControl>
  );
}

export const DateInput = forwardRef(DateInputRender) as DateInputComponent;
