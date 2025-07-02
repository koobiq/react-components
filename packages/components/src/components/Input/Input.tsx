'use client';

import { type ComponentRef, forwardRef } from 'react';

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
    hiddenLabel = false,
    disabled = false,
    isDisabled: isDisabledProp = false,
    error = false,
    isInvalid: isInvalidProp = false,
    required = false,
    isRequired: isRequiredProp = false,
    readonly = false,
    isReadOnly: isReadOnlyProp = false,
    label,
    startAddon,
    endAddon,
    errorMessage,
    slotProps,
    caption,
    ...other
  } = props;

  const isDisabled = isDisabledProp || disabled;
  const isRequired = isRequiredProp || required;
  const isReadOnly = isReadOnlyProp || readonly;
  const isInvalid = isInvalidProp || error;

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
        >({ hidden: hiddenLabel, isRequired }, slotProps?.label);

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
