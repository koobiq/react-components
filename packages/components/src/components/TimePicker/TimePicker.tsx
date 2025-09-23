import { forwardRef, type Ref } from 'react';

import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import { IconClock16 } from '@koobiq/react-icons';
import {
  FieldErrorContext,
  FormContext,
  type TimeValue,
  useSlottedContext,
} from '@koobiq/react-primitives';
import {
  useTimeFieldState,
  useTimeField,
  removeDataAttributes,
} from '@koobiq/react-primitives';

import { DateSegment } from '../DateSegment';
import {
  type FormFieldCaptionProps,
  type FormFieldErrorProps,
  type FormFieldInputDateProps,
  type FormFieldControlGroupProps,
  FormField,
  type FormFieldProps,
  FormFieldLabel,
  type FormFieldLabelProps,
} from '../FormField';
import {
  FormFieldCaption,
  FormFieldError,
  FormFieldInputDate,
  FormFieldControlGroup,
} from '../FormField';

import s from './TimePicker.module.css';
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
    labelPlacement,
    errorMessage,
    labelAlign,
    caption,
    label,
    slotProps,
    style,
    fullWidth,
    variant,
    className,
    endAddon,
    startAddon,
    'data-testid': testId,
  } = props;

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const state = useTimeFieldState({
    ...removeDataAttributes(props),
    validationBehavior,
    locale,
  });

  const {
    labelProps: labelPropReactAria,
    fieldProps,
    descriptionProps,
    errorMessageProps,
    inputProps,
    ...validation
  } = useTimeField(removeDataAttributes(props), state, domRef);

  const { isDisabled, isRequired, isReadOnly } = state;

  const { isInvalid } = validation;

  const rootProps = mergeProps<[FormFieldProps, FormFieldProps | undefined]>(
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

  const groupProps = mergeProps<
    [FormFieldControlGroupProps, FormFieldControlGroupProps | undefined]
  >(
    {
      startAddon: (
        <>
          {startAddon}
          <IconClock16 className={s.clock} />
        </>
      ),
      variant,
      isInvalid,
      isDisabled,
      endAddon,
    },
    slotProps?.group
  );

  const controlProps = mergeProps<
    [
      FormFieldInputDateProps,
      FormFieldInputDateProps | undefined,
      FormFieldInputDateProps,
    ]
  >(
    {
      ref: domRef,
    },
    slotProps?.inputDate,
    fieldProps
  );

  const labelProps = mergeProps<
    [FormFieldLabelProps, FormFieldLabelProps, FormFieldLabelProps | undefined]
  >(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropReactAria,
    slotProps?.label
  );

  const captionProps = mergeProps<
    [
      FormFieldCaptionProps,
      FormFieldCaptionProps | undefined,
      FormFieldCaptionProps,
    ]
  >({ children: caption }, slotProps?.caption, descriptionProps);

  const errorProps = mergeProps<
    [FormFieldErrorProps, FormFieldErrorProps | undefined, FormFieldErrorProps]
  >(
    {
      children: errorMessage,
    },
    slotProps?.errorMessage,
    errorMessageProps
  );

  return (
    <FormField {...rootProps}>
      <FormFieldLabel {...labelProps} />
      <div className={s.body}>
        <FormFieldControlGroup
          {...groupProps}
          slotProps={{ startAddon: { className: s.startAddon } }}
        >
          <FormFieldInputDate {...controlProps}>
            {state.segments.map((segment, i) => (
              <DateSegment key={i} segment={segment} state={state} />
            ))}
            <input {...inputProps} />
          </FormFieldInputDate>
        </FormFieldControlGroup>
        <FormFieldCaption {...captionProps} />
        <FieldErrorContext.Provider value={validation}>
          <FormFieldError {...errorProps} />
        </FieldErrorContext.Provider>
      </div>
    </FormField>
  );
}

export const TimePicker = forwardRef(TimePickerRender) as TimePickerComponent;
