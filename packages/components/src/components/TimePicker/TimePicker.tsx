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
  useTimeField,
  useTimeFieldState,
  removeDataAttributes,
} from '@koobiq/react-primitives';

import { DateSegment } from '../DateSegment';
import { useForm } from '../Form';
import {
  type FormFieldProps,
  type FormFieldErrorProps,
  type FormFieldLabelProps,
  type FormFieldCaptionProps,
  type FormFieldInputDateProps,
  type FormFieldControlGroupProps,
} from '../FormField';
import { FormField } from '../FormField';

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
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    isRequired,
    style,
    fullWidth,
    variant,
    className,
    endAddon,
    startAddon,
    'data-testid': testId,
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const state = useTimeFieldState({
    ...removeDataAttributes({ ...props, isDisabled, isReadOnly }),
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
  } = useTimeField(
    removeDataAttributes({ ...props, isDisabled, isReadOnly }),
    state,
    domRef
  );

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

  const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
    {
      startAddon: (
        <>
          {startAddon}
          <IconClock16 className={s.clock} />
        </>
      ),
      onMouseDown: (e) => {
        if (e.currentTarget !== e.target) return;
        e.preventDefault();
        labelPropReactAria?.onClick?.(e);
      },
      variant,
      isInvalid,
      isDisabled,
      endAddon,
    },
    slotProps?.group
  );

  const controlProps = mergeProps<(FormFieldInputDateProps | undefined)[]>(
    { ref: domRef },
    fieldProps,
    slotProps?.inputDate
  );

  const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
    { isHidden: isLabelHidden, children: label, isRequired },
    labelPropReactAria,
    slotProps?.label
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

  return (
    <FormField {...rootProps}>
      <FormField.Label {...labelProps} />
      <div className={s.body}>
        <FormField.ControlGroup
          {...groupProps}
          slotProps={{ startAddon: { className: s.startAddon } }}
        >
          <FormField.InputDate {...controlProps}>
            {state.segments.map((segment, i) => (
              <DateSegment key={i} segment={segment} state={state} />
            ))}
            <input {...inputProps} />
          </FormField.InputDate>
        </FormField.ControlGroup>
        <FieldErrorContext.Provider value={validation}>
          <FormField.Error {...errorProps} />
        </FieldErrorContext.Provider>
        <FormField.Caption {...captionProps} />
      </div>
    </FormField>
  );
}

export const TimePicker = forwardRef(TimePickerRender) as TimePickerComponent;
