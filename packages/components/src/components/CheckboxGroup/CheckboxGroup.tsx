'use client';

import { type ComponentRef, forwardRef } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import {
  FieldErrorContext,
  useCheckboxGroup,
  // useCheckboxGroupItem,
  useCheckboxGroupState,
} from '@koobiq/react-primitives';

import {
  FormField,
  type FormFieldCaptionProps,
  type FormFieldErrorProps,
  type FormFieldLabelProps,
  type FormFieldProps,
} from '../FormField';

import s from './CheckboxGroup.module.css';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import type { CheckboxGroupProps } from './types';

export const CheckboxGroup = forwardRef<
  ComponentRef<'div'>,
  CheckboxGroupProps
>((props, ref) => {
  const {
    label,
    style,
    caption,
    children,
    className,
    slotProps,
    isReadOnly,
    isDisabled,
    isRequired,
    labelAlign,
    errorMessage,
    isLabelHidden,
    labelPlacement,
    'data-testid': testId,
  } = props;

  const state = useCheckboxGroupState(props);

  const {
    groupProps,
    labelProps: ariaLabelProps,
    descriptionProps: ariaDescriptionProps,
    errorMessageProps: ariaErrorMessageProps,
    ...validation
  } = useCheckboxGroup(props, state);

  const { isInvalid } = validation;

  const rootProps = mergeProps<
    [FormFieldProps | undefined, typeof groupProps, FormFieldProps | undefined]
  >(
    {
      ref,
      style,
      labelAlign,
      labelPlacement,
      'data-testid': testId,
      className: clsx(s.base, className),
      'data-invalid': isInvalid || undefined,
      'data-readonly': isReadOnly || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
    },
    groupProps,
    slotProps?.root
  );

  const labelProps = mergeProps<(FormFieldLabelProps<'span'> | undefined)[]>(
    {
      as: 'span',
      isRequired,
      children: label,
      className: s.label,
      isHidden: isLabelHidden,
    },
    ariaLabelProps,
    slotProps?.label
  );

  const errorMessageProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
    { children: errorMessage },
    ariaErrorMessageProps,
    slotProps?.errorMessage
  );

  const descriptionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
    { children: caption },
    ariaDescriptionProps,
    slotProps?.caption
  );

  return (
    <FormField {...rootProps}>
      <FormField.Label {...labelProps} />
      <div className={s.body}>
        <CheckboxGroupContext.Provider value={state}>
          {children}
        </CheckboxGroupContext.Provider>
        <FormField.Caption {...descriptionProps} />
        <FieldErrorContext.Provider value={validation}>
          <FormField.Error {...errorMessageProps} />
        </FieldErrorContext.Provider>
      </div>
    </FormField>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';
