'use client';

import { type ComponentRef, forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';

import {
  FieldInput,
  FieldLabel,
  FieldControl,
  FieldError,
  FieldCaption,
  FieldInputGroup,
  type FieldControlProps,
} from '../FieldComponents';

import type { InputProps, InputRef } from './index';

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    variant = 'filled',
    fullWidth = false,
    hiddenLabel = false,
    label,
    startAddon,
    endAddon,
    errorMessage,
    slotProps,
    caption,
    ...other
  } = props;

  const inputRef = useDOMRef<ComponentRef<'input'>>(ref);

  const rootProps: FieldControlProps = mergeProps(
    {
      label,
      fullWidth,
      errorMessage,
      'data-variant': variant,
      'data-fullwidth': fullWidth,
    },
    other
  );

  return (
    <FieldControl {...rootProps}>
      {({ error, required, disabled }) => {
        const labelProps = mergeProps(
          { hidden: hiddenLabel, required },
          slotProps?.label
        );

        const inputProps = mergeProps(
          {
            error,
            variant,
            disabled,
            ref: inputRef,
          },
          slotProps?.input
        );

        const groupProps = mergeProps(
          {
            error,
            endAddon,
            startAddon,
          },
          slotProps?.group
        );

        const captionProps = slotProps?.caption;

        const errorProps = mergeProps({ error }, slotProps?.errorMessage);

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
