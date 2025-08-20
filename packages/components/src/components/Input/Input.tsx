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
  FieldContentGroup,
  type FieldLabelProps,
  type FieldContentGroupProps,
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
    [
      FieldControlProps<typeof TextField<HTMLInputElement>>,
      FieldControlProps<typeof TextField<HTMLInputElement>> | undefined,
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
      'data-variant': variant,
      'data-fullwidth': fullWidth,
      ...other,
    },
    slotProps?.root
  );

  return (
    <FieldControl as={TextField} inputElementType="input" {...rootProps}>
      {({ isInvalid, isRequired, isDisabled }) => {
        const labelProps = mergeProps<
          [FieldLabelProps, FieldLabelProps | undefined]
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
        >({ isInvalid, children: errorMessage }, slotProps?.errorMessage);

        return (
          <>
            <FieldLabel {...labelProps} />
            <FieldContentGroup {...groupProps}>
              <FieldInput {...inputProps} />
            </FieldContentGroup>
            <FieldCaption {...captionProps} />
            <FieldError {...errorProps} />
          </>
        );
      }}
    </FieldControl>
  );
});

Input.displayName = 'Input';
