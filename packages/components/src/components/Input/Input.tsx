'use client';

import { type ComponentRef, forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { TextField } from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldInputProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField } from '../FormField';

import type { InputProps, InputRef } from './index';
import s from './Input.module.css';

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    variant = 'filled',
    fullWidth,
    hiddenLabel,
    isLabelHidden: isLabelHiddenProp,
    disabled,
    isDisabled: isDisabledProp,
    error,
    isInvalid: isInvalidProp,
    required,
    isRequired: isRequiredProp,
    readonly,
    isReadOnly: isReadOnlyProp,
    labelPlacement,
    labelAlign,
    label,
    startAddon,
    endAddon,
    errorMessage,
    slotProps,
    caption,
    ...other
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const isDisabled = isDisabledProp ?? disabled ?? formIsDisabled;
  const isReadOnly = isReadOnlyProp ?? readonly ?? formIsReadOnly;
  const isRequired = isRequiredProp ?? required;
  const isInvalid = isInvalidProp ?? error;
  const isLabelHidden = isLabelHiddenProp ?? hiddenLabel;

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'Input: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'required' in props) {
    deprecate(
      'Input: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'error' in props) {
    deprecate(
      'Input: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
    deprecate(
      'Input: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'hiddenLabel' in props) {
    deprecate(
      'Input: the "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.'
    );
  }

  const inputRef = useDOMRef<ComponentRef<'input'>>(ref);

  const rootProps = mergeProps<
    (FormFieldProps<typeof TextField<HTMLInputElement>> | undefined)[]
  >(
    {
      label,
      fullWidth,
      isDisabled,
      isRequired,
      isReadOnly,
      isInvalid,
      errorMessage,
      labelPlacement,
      labelAlign,
      'data-variant': variant,
      ...other,
    },
    slotProps?.root
  );

  return (
    <FormField as={TextField} inputElementType="input" {...rootProps}>
      {({ isInvalid, isRequired, isDisabled }) => {
        const labelProps = mergeProps<(FormFieldLabelProps | undefined)[]>(
          { isHidden: isLabelHidden, isRequired, children: label },
          slotProps?.label
        );

        const inputProps = mergeProps<(FormFieldInputProps | undefined)[]>(
          { ref: inputRef },
          slotProps?.input
        );

        const groupProps = mergeProps<
          (FormFieldControlGroupProps | undefined)[]
        >(
          {
            endAddon,
            variant,
            onMouseDown: (e) => {
              if (e.currentTarget !== e.target) return;
              e.preventDefault();
              inputRef?.current?.focus();
            },
            isInvalid,
            isDisabled,
            startAddon,
          },
          slotProps?.group
        );

        const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
          { children: caption },
          slotProps?.caption
        );

        const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
          { children: errorMessage },
          slotProps?.errorMessage
        );

        return (
          <>
            <FormField.Label {...labelProps} />
            <div className={s.body}>
              <FormField.ControlGroup {...groupProps}>
                <FormField.Input {...inputProps} />
              </FormField.ControlGroup>
              <FormField.Caption {...captionProps} />
              <FormField.Error {...errorProps} />
            </div>
          </>
        );
      }}
    </FormField>
  );
});

Input.displayName = 'Input';
