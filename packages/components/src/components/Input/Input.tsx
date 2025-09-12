'use client';

import { type ComponentRef, forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { TextField } from '@koobiq/react-primitives';

import {
  FieldInput,
  FieldCaption,
  FieldContentGroup,
  type FieldContentGroupProps,
  type FieldCaptionProps,
  type FieldInputProps,
  Field,
  FieldError,
  type FieldErrorProps,
} from '../FieldComponents';
import { FormControl, type FormControlProps } from '../FormControl';
import {
  FormControlLabel,
  type FormControlLabelProps,
} from '../FormControlLabel';

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

  const isDisabled = isDisabledProp ?? disabled;
  const isRequired = isRequiredProp ?? required;
  const isReadOnly = isReadOnlyProp ?? readonly;
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
    [
      FormControlProps<typeof TextField<HTMLInputElement>>,
      FormControlProps<typeof TextField<HTMLInputElement>> | undefined,
    ]
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
    <FormControl as={TextField} inputElementType="input" {...rootProps}>
      {({ isInvalid, isRequired, isDisabled }) => {
        const labelProps = mergeProps<
          [FormControlLabelProps, FormControlLabelProps | undefined]
        >(
          { isHidden: isLabelHidden, isRequired, children: label },
          slotProps?.label
        );

        const inputProps = mergeProps<
          [FieldInputProps, FieldInputProps | undefined]
        >(
          {
            variant,
            isInvalid,
            isDisabled,
            ref: inputRef,
          },
          slotProps?.input
        );

        const groupProps = mergeProps<
          [FieldContentGroupProps, FieldContentGroupProps | undefined]
        >(
          {
            endAddon,
            variant,
            isInvalid,
            isDisabled,
            startAddon,
          },
          slotProps?.group
        );

        const captionProps = mergeProps<
          [FieldCaptionProps, FieldCaptionProps | undefined]
        >({ children: caption }, slotProps?.caption);

        const errorProps = mergeProps<
          [FieldErrorProps, FieldErrorProps | undefined]
        >(
          { children: errorMessage, className: s.error },
          slotProps?.errorMessage
        );

        return (
          <>
            <FormControlLabel {...labelProps} />
            <Field>
              <FieldContentGroup {...groupProps}>
                <FieldInput {...inputProps} />
              </FieldContentGroup>
              <FieldCaption {...captionProps} />
              <FieldError {...errorProps} />
            </Field>
          </>
        );
      }}
    </FormControl>
  );
});

Input.displayName = 'Input';
