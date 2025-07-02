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
  FieldControl,
  FieldInputDate,
  FieldInputGroup,
  FieldLabel,
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
  const { locale } = useLocale();
  const { slotProps, caption } = props;

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
  } = useDateField(props, state, domRef);

  const labelProps = mergeProps(slotProps?.label, labelPropReactAria);

  const groupProps = slotProps?.group;

  const captionProps = mergeProps(slotProps?.caption, descriptionProps);

  return (
    <FieldControl className={s.base}>
      <FieldLabel {...labelProps}>{props.label}</FieldLabel>
      <FieldInputGroup {...groupProps}>
        <FieldInputDate {...fieldProps} ref={domRef}>
          {state.segments.map((segment, i) => (
            <DateInputSegment key={i} segment={segment} state={state} />
          ))}
        </FieldInputDate>
      </FieldInputGroup>
      {state.isInvalid && <span aria-hidden="true">🚫</span>}
      <FieldCaption {...captionProps}>
        {captionProps?.children || caption}
      </FieldCaption>
    </FieldControl>
  );
}

export const DateInput = forwardRef(DateInputRender) as DateInputComponentProp;
