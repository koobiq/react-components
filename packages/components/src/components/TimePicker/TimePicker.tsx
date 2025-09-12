import { forwardRef, type Ref } from 'react';

import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import { IconClock16 } from '@koobiq/react-icons';
import { FieldErrorContext, type TimeValue } from '@koobiq/react-primitives';
import {
  useTimeFieldState,
  useTimeField,
  removeDataAttributes,
} from '@koobiq/react-primitives';

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

  const state = useTimeFieldState({
    ...removeDataAttributes(props),
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

  const groupProps = mergeProps<
    [FieldContentGroupProps, FieldContentGroupProps | undefined]
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

  return (
    <FormControl {...rootProps}>
      <FormControlLabel {...labelProps} />
      <Field>
        <FieldContentGroup
          {...groupProps}
          slotProps={{ startAddon: { className: s.startAddon } }}
        >
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

export const TimePicker = forwardRef(TimePickerRender) as TimePickerComponent;
