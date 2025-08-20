import { forwardRef, type Ref } from 'react';

import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import { IconClock16 } from '@koobiq/react-icons';
import type { TimeValue } from '@koobiq/react-primitives';
import {
  useTimeFieldState,
  useTimeField,
  removeDataAttributes,
} from '@koobiq/react-primitives';

import { DateSegment } from '../DateSegment';
import {
  FieldCaption,
  FieldControl,
  FieldError,
  FieldInputDate,
  FieldContentGroup,
  FieldLabel,
} from '../FieldComponents';
import type {
  FieldCaptionProps,
  FieldControlProps,
  FieldErrorProps,
  FieldInputDateProps,
  FieldContentGroupProps,
  FieldLabelProps,
} from '../FieldComponents';

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
    caption,
    label,
    slotProps,
    style,
    fullWidth,
    variant,
    className,
    endAddon,
    startAddon,
    errorMessage,
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
    ...validation
  } = useTimeField(removeDataAttributes(props), state, domRef);

  const { isInvalid, isDisabled, isRequired, isReadOnly } = state;

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
    [FieldLabelProps, FieldLabelProps, FieldLabelProps | undefined]
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
      isInvalid,
      children:
        typeof errorMessage === 'function'
          ? errorMessage({ ...validation })
          : errorMessage,
    },
    slotProps?.errorMessage,
    errorMessageProps
  );

  return (
    <FieldControl {...rootProps}>
      <FieldLabel {...labelProps} />
      <FieldContentGroup
        {...groupProps}
        slotProps={{ startAddon: { className: s.startAddon } }}
      >
        <FieldInputDate {...controlProps}>
          {state.segments.map((segment, i) => (
            <DateSegment key={i} segment={segment} state={state} />
          ))}
        </FieldInputDate>
      </FieldContentGroup>
      <FieldCaption {...captionProps} />
      <FieldError {...errorProps} />
    </FieldControl>
  );
}

export const TimePicker = forwardRef(TimePickerRender) as TimePickerComponent;
