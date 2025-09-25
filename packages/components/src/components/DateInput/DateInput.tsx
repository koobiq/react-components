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
  useSlottedContext,
  FormContext,
} from '@koobiq/react-primitives';
import type { DateValue } from '@koobiq/react-primitives';

import { DateSegment } from '../DateSegment';
import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldInputDateProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField } from '../FormField';

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

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const {
    labelProps: labelPropReactAria,
    fieldProps,
    descriptionProps,
    errorMessageProps,
    inputProps,
    ...validation
  } = useDateField(
    { ...removeDataAttributes(props), validationBehavior },
    state,
    domRef
  );

  const { isRequired, isDisabled } = state;
  const { isInvalid } = validation;

  const rootProps = mergeProps<(FormFieldProps | undefined)[]>(
    {
      style,
      fullWidth,
      labelPlacement,
      labelAlign,
      'data-testid': testId,
      'data-variant': variant,
      'data-invalid': isInvalid || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
      'data-readonly': isReadOnly || undefined,
      className: clsx(s.base, className),
    },
    slotProps?.root
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropReactAria,
    slotProps?.label
  );

  const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
    {
      endAddon,
      isInvalid,
      isDisabled,
      startAddon,
      variant,
    },
    slotProps?.group
  );

  const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
    { children: caption },
    descriptionProps,
    slotProps?.caption
  );

  const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
    { children: errorMessage },
    errorMessageProps,
    slotProps?.errorMessage
  );

  const controlProps = mergeProps<(FormFieldInputDateProps | undefined)[]>(
    { ref: domRef },
    fieldProps,
    slotProps?.inputDate
  );

  return (
    <FormField {...rootProps}>
      <FormField.Label {...labelProps} />
      <div className={s.body}>
        <FormField.ControlGroup {...groupProps}>
          <FormField.InputDate {...controlProps}>
            {state.segments.map((segment, i) => (
              <DateSegment key={i} segment={segment} state={state} />
            ))}
            <input {...inputProps} />
          </FormField.InputDate>
        </FormField.ControlGroup>
        <FormField.Caption {...captionProps} />
        <FieldErrorContext.Provider value={validation}>
          <FormField.Error {...errorProps} />
        </FieldErrorContext.Provider>
      </div>
    </FormField>
  );
}

export const DateInput = forwardRef(DateInputRender) as DateInputComponent;
