import { forwardRef } from 'react';
import type { Ref } from 'react';

import { createCalendar } from '@internationalized/date';
import { mergeProps, useDOMRef } from '@koobiq/react-core';
import {
  useLocale,
  useDateField,
  useDateFieldState,
} from '@koobiq/react-primitives';
import type { DateValue } from '@koobiq/react-primitives';

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldControl,
  FieldError,
  type FieldErrorProps,
  FieldInputDate,
  type FieldInputDateProps,
  FieldInputGroup,
  type FieldInputGroupProps,
  FieldLabel,
  type FieldLabelProps,
} from '../FieldComponents';

import { DateInputSegment } from './components';
import s from './DateInput.module.css';
import type {
  DateInputRef,
  DateInputProps,
  DateInputComponentProp,
} from './types';

export function DateInputRender<T extends DateValue>(
  props: DateInputProps<T>,
  ref: Ref<DateInputRef>
) {
  const { errorMessage } = props;
  const { locale } = useLocale();
  const { slotProps, caption, startAddon, endAddon, isLabelHidden } = props;

  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const domRef = useDOMRef(ref);

  const {
    labelProps: labelPropReactAria,
    fieldProps,
    descriptionProps,
    errorMessageProps,
  } = useDateField(props, state, domRef);

  const { isInvalid, isRequired, isDisabled } = state;

  const labelProps = mergeProps<
    [FieldLabelProps, FieldLabelProps, FieldLabelProps | undefined]
  >(
    { isHidden: isLabelHidden, isRequired },
    labelPropReactAria,
    slotProps?.label
  );

  const groupProps = mergeProps<
    [FieldInputGroupProps, FieldInputGroupProps | undefined]
  >(
    {
      endAddon,
      isInvalid,
      startAddon,
    },
    slotProps?.group
  );

  const captionProps = mergeProps<
    [FieldCaptionProps, FieldCaptionProps | undefined, FieldCaptionProps]
  >({ isInvalid }, slotProps?.caption, descriptionProps);

  const errorProps = mergeProps<
    [FieldErrorProps, FieldErrorProps | undefined, FieldErrorProps]
  >({ isInvalid }, slotProps?.errorMessage, errorMessageProps);

  const controlProps = mergeProps<
    [FieldInputDateProps, FieldInputDateProps | undefined, FieldInputDateProps]
  >(
    {
      isInvalid,
      isDisabled,
      ref: domRef,
    },
    slotProps?.inputDate,
    fieldProps
  );

  return (
    <FieldControl className={s.base}>
      <FieldLabel {...labelProps}>{props.label}</FieldLabel>
      <FieldInputGroup {...groupProps}>
        <FieldInputDate {...controlProps}>
          {state.segments.map((segment, i) => (
            <DateInputSegment key={i} segment={segment} state={state} />
          ))}
        </FieldInputDate>
      </FieldInputGroup>
      <FieldCaption {...captionProps}>
        {captionProps?.children || caption}
      </FieldCaption>
      <FieldError {...errorProps}>
        {errorProps.children || errorMessage}
      </FieldError>
    </FieldControl>
  );
}

export const DateInput = forwardRef(DateInputRender) as DateInputComponentProp;
