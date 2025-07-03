'use client';

import { type ComponentRef, forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { TextField } from '@koobiq/react-primitives';

import {
  FieldInput,
  FieldLabel,
  FieldControl,
  FieldError,
  FieldCaption,
  FieldInputGroup,
  type FieldLabelProps,
  type FieldInputGroupProps,
  type FieldCaptionProps,
  type FieldErrorProps,
  type FieldInputProps,
  type FieldControlProps,
} from '../FieldComponents';

import type { InputProps, InputRef } from './index';

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    variant = 'filled',
    fullWidth = false,
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
    label,
    startAddon,
    endAddon,
    errorMessage,
    slotProps,
    caption,
    ...other
  } = props;

  const isDisabled = isDisabledProp ?? disabled ?? false;
  const isRequired = isRequiredProp ?? required ?? false;
  const isReadOnly = isReadOnlyProp ?? readonly ?? false;
  const isInvalid = isInvalidProp ?? error ?? false;
  const isLabelHidden = isLabelHiddenProp ?? hiddenLabel ?? false;

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
    [FieldControlProps<typeof TextField>, FieldControlProps | undefined]
  >(
    {
      label,
      fullWidth,
      isDisabled,
      isRequired,
      isReadOnly,
      isInvalid,
      errorMessage,
      'data-variant': variant,
      'data-fullwidth': fullWidth,
      ...other,
    },
    slotProps?.root
  );

  return (
    <FieldControl as={TextField} {...rootProps}>
      {({ isInvalid, isRequired, isDisabled }) => {
        const labelProps = mergeProps<
          [FieldLabelProps, FieldLabelProps | undefined]
        >({ isHidden: isLabelHidden, isRequired }, slotProps?.label);

        const inputProps = mergeProps<
          [FieldInputProps<'input'>, FieldInputProps<'input'> | undefined]
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
          [FieldInputGroupProps, FieldInputGroupProps | undefined]
        >(
          {
            endAddon,
            isInvalid,
            startAddon,
          },
          slotProps?.group
        );

        const captionProps: FieldCaptionProps | undefined = mergeProps(
          { isInvalid },
          slotProps?.caption
        );

        const errorProps = mergeProps<
          [FieldErrorProps, FieldErrorProps | undefined]
        >({ isInvalid }, slotProps?.errorMessage);

        return (
          <>
            <FieldLabel {...labelProps}>
              {labelProps?.children || label}
            </FieldLabel>
            <FieldInputGroup {...groupProps}>
              <FieldInput {...inputProps} />
            </FieldInputGroup>
            <FieldCaption {...captionProps}>
              {captionProps?.children || caption}
            </FieldCaption>
            <FieldError {...errorProps}>
              {errorProps.children || errorMessage}
            </FieldError>
          </>
        );
      }}
    </FieldControl>
  );
});

Input.displayName = 'Input';
