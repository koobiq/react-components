'use client';

import { type ComponentRef, forwardRef } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import {
  FieldErrorContext,
  useCheckboxGroup,
  useCheckboxGroupState,
  CheckboxGroupContext as CheckboxGroupPrimitiveContext,
  removeDataAttributes,
} from '@koobiq/react-primitives';

import { useForm } from '../Form';
import { FormField } from '../FormField';
import type {
  FormFieldCaptionProps,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldProps,
} from '../FormField';
import { flex } from '../layout';

import s from './CheckboxGroup.module.css';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import type { CheckboxGroupProps } from './types';

export const CheckboxGroup = forwardRef<
  ComponentRef<'div'>,
  CheckboxGroupProps
>((props, ref) => {
  const {
    size = 'normal',
    label,
    style,
    caption,
    children,
    className,
    slotProps,
    isReadOnly: isReadOnlyProp,
    isDisabled: isDisabledProp,
    isRequired,
    labelAlign,
    orientation,
    errorMessage,
    isLabelHidden,
    labelPlacement,
    'data-testid': testId,
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const isDisabled = isDisabledProp ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? formIsReadOnly;

  const state = useCheckboxGroupState(
    removeDataAttributes({ ...props, isDisabled, isReadOnly })
  );

  const {
    groupProps,
    labelProps: labelPropsAria,
    descriptionProps: descriptionPropsAria,
    errorMessageProps: errorMessagePropsAria,
    ...validation
  } = useCheckboxGroup(
    removeDataAttributes({ ...props, isDisabled, isReadOnly }),
    state
  );

  const { isInvalid } = validation;

  const rootProps = mergeProps<
    [FormFieldProps | undefined, typeof groupProps, FormFieldProps | undefined]
  >(
    {
      ref,
      style,
      labelAlign,
      labelPlacement,
      'data-size': size,
      'data-testid': testId,
      'data-orientation': orientation,
      className: clsx(s.base, className),
      'data-invalid': isInvalid || undefined,
      'data-readonly': isReadOnly || undefined,
      'data-disabled': isDisabled || undefined,
      'data-required': isRequired || undefined,
    },
    groupProps,
    slotProps?.root
  );

  const checkboxGroupProps = mergeProps(
    {
      className: flex({
        direction: orientation === 'horizontal' ? 'row' : 'column',
        alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
        gap: 's',
      }),
    },
    slotProps?.checkboxGroup
  );

  const labelProps = mergeProps<(FormFieldLabelProps<'span'> | undefined)[]>(
    {
      as: 'span',
      isRequired,
      children: label,
      className: s.label,
      isHidden: isLabelHidden,
    },
    labelPropsAria,
    slotProps?.label
  );

  const errorMessageProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
    { children: errorMessage },
    errorMessagePropsAria,
    slotProps?.errorMessage
  );

  const descriptionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
    { children: caption },
    descriptionPropsAria,
    slotProps?.caption
  );

  return (
    <CheckboxGroupContext.Provider value={{ size }}>
      <FormField {...rootProps}>
        <FormField.Label {...labelProps} />
        <div className={s.body}>
          <CheckboxGroupPrimitiveContext.Provider value={state}>
            <div {...checkboxGroupProps}>{children}</div>
          </CheckboxGroupPrimitiveContext.Provider>
          <FormField.Caption {...descriptionProps} />
          <FieldErrorContext.Provider value={validation}>
            <FormField.Error {...errorMessageProps} />
          </FieldErrorContext.Provider>
        </div>
      </FormField>
    </CheckboxGroupContext.Provider>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';
