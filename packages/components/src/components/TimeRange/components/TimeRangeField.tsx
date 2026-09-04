'use client';

import { forwardRef, useRef } from 'react';
import type { ReactNode } from 'react';

import {
  ClearPressResponder,
  PressResponder,
  mergeProps,
  mergeRefs,
} from '@koobiq/react-core';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import {
  ButtonContext,
  FieldErrorContext,
  TextContext,
  useField,
} from '@koobiq/react-primitives';

import { FormField } from '../../FormField';
import type {
  FormFieldControlGroupProps,
  FormFieldLabelProps,
  FormFieldProps,
} from '../../FormField';
import s from '../TimeRange.module.css';
import type { TimeRangeFieldProps, TimeRangeFieldRef } from '../types';

import { useTimeRangeContext } from './TimeRangeContext';

// Links and buttons in a label, description or addon are independent of the trigger.
function FieldDecoration({ children }: { children: ReactNode }) {
  return (
    <ClearPressResponder>
      <ButtonContext.Provider value={null}>{children}</ButtonContext.Provider>
    </ClearPressResponder>
  );
}

export const TimeRangeField = forwardRef<
  TimeRangeFieldRef,
  TimeRangeFieldProps
>((props, ref) => {
  const {
    label,
    isLabelHidden,
    isRequired,
    isInvalid = false,
    isDisabled: isDisabledProp,
    errorMessage,
    caption,
    fullWidth,
    labelPlacement,
    labelAlign,
    placeholder,
    className,
    style,
    slotProps,
    ...other
  } = props;

  const {
    formattedValue,
    isEmpty,
    isDisabled: contextDisabled,
    groupRef,
  } = useTimeRangeContext();

  const controlRef = useRef<HTMLDivElement>(null);

  const isDisabled =
    contextDisabled || isDisabledProp || slotProps?.group?.isDisabled || false;

  const resolvedLabel = slotProps?.label?.children ?? label;
  const resolvedCaption = slotProps?.caption?.children ?? caption;
  const resolvedError = slotProps?.errorMessage?.children ?? errorMessage;

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({
      ...other,
      ...slotProps?.control,
      label: resolvedLabel,
      description: resolvedCaption,
      errorMessage: isInvalid && Boolean(resolvedError),
      isInvalid,
      labelElementType: 'span',
    });

  const rootProps = mergeProps<(FormFieldProps | undefined)[]>(
    {
      fullWidth,
      labelPlacement,
      labelAlign,
      className,
      style,
      'data-invalid': isInvalid || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
    },
    slotProps?.root
  );

  const labelSlotProps = mergeProps<
    (FormFieldLabelProps<'span'> | undefined)[]
  >(
    {
      as: 'span',
      isHidden: isLabelHidden,
      isRequired,
      children: label,
      onClick: () => {
        if (!isDisabled) controlRef.current?.focus();
      },
    },
    labelProps,
    slotProps?.label
  );

  const groupProps = mergeProps<(FormFieldControlGroupProps | undefined)[]>(
    {
      isDisabled,
      isInvalid,
      endAddon: <IconChevronDownS16 className={s.addon} />,
      onMouseDown: (event) => {
        const target = event.target as Element;
        if (
          isDisabled ||
          controlRef.current?.contains(target) ||
          target.closest('button, a, input, [role="button"], [role="link"]')
        )
          return;
        event.preventDefault();
        controlRef.current?.focus();
        controlRef.current?.click();
      },
    },
    slotProps?.group
  );

  const controlProps = mergeProps(
    other,
    fieldProps,
    {
      'aria-invalid': isInvalid || undefined,
      placeholder,
      children: isEmpty ? undefined : formattedValue,
    },
    slotProps?.control,
    { 'aria-describedby': fieldProps['aria-describedby'] }
  );

  const errorProps = mergeProps(
    { children: errorMessage },
    errorMessageProps,
    slotProps?.errorMessage
  );

  const {
    children: errorChildren,
    ref: errorRef,
    className: errorClassName,
    style: errorStyle,
    ...errorTextProps
  } = errorProps;

  return (
    <FormField {...rootProps}>
      <FieldDecoration>
        <FormField.Label {...labelSlotProps} />
      </FieldDecoration>
      <div className={s.body}>
        <FormField.ControlGroup
          {...groupProps}
          ref={mergeRefs(groupRef, groupProps.ref)}
          isDisabled={isDisabled}
          startAddon={
            groupProps.startAddon != null ? (
              <FieldDecoration>{groupProps.startAddon}</FieldDecoration>
            ) : undefined
          }
          endAddon={
            groupProps.endAddon != null ? (
              <FieldDecoration>{groupProps.endAddon}</FieldDecoration>
            ) : undefined
          }
        >
          <PressResponder {...{ 'aria-invalid': isInvalid || undefined }}>
            <FormField.Select
              {...controlProps}
              ref={mergeRefs(ref, controlRef, controlProps.ref)}
            />
          </PressResponder>
        </FormField.ControlGroup>
        <FieldDecoration>
          <FieldErrorContext.Provider
            value={{
              isInvalid,
              validationErrors: [],
              validationDetails: {} as ValidityState,
            }}
          >
            <TextContext.Provider
              value={{ slots: { errorMessage: errorTextProps } }}
            >
              <FormField.Error
                ref={errorRef}
                className={errorClassName}
                style={errorStyle}
              >
                {errorChildren}
              </FormField.Error>
            </TextContext.Provider>
          </FieldErrorContext.Provider>
          <FormField.Caption
            {...mergeProps(
              { children: caption },
              descriptionProps,
              slotProps?.caption
            )}
          />
        </FieldDecoration>
      </div>
    </FormField>
  );
});

TimeRangeField.displayName = 'TimeRange.Field';
