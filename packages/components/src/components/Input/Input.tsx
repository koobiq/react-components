'use client';

import { type ComponentRef, forwardRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { useTextField } from '@koobiq/react-primitives';

import {
  FieldInput,
  FieldAddon,
  FieldLabel,
  FieldControl,
  FieldCaption,
  FieldInputGroup,
  FieldError,
} from './components';
import s from './Input.module.css';
import { type InputProps } from './types';

export const Input = forwardRef<ComponentRef<'input'>, InputProps>(
  (props, ref) => {
    const {
      variant = 'filled',
      fullWidth = false,
      hiddenLabel = false,
      required = false,
      errorMessage,
      slotProps,
      caption,
      className,
      label,
      startAddon,
      endAddon,
    } = props;

    const domRef = useDOMRef<ComponentRef<'input'>>(ref);

    const { error, ...commonProps } = useTextField(props, domRef);

    const hasStartAddon = !!startAddon;
    const hasEndAddon = !!endAddon;

    const rootProps = mergeProps({
      className,
      fullWidth,
      ...slotProps?.root,
    });

    const labelProps = mergeProps({
      hiddenLabel,
      required,
      ...commonProps.labelProps,
      ...slotProps?.label,
    });

    const inputProps = mergeProps({
      error,
      variant,
      className: clsx(
        hasEndAddon && s.hasEndAddon,
        hasStartAddon && s.hasStartAddon
      ),
      ...commonProps.inputProps,
      ...slotProps?.input,
      ref: domRef,
    });

    const captionProps = mergeProps({
      ...commonProps.descriptionProps,
      ...slotProps?.caption,
    });

    const errorProps = mergeProps({
      error,
      ...commonProps.errorMessageProps,
      ...slotProps?.errorMessage,
    });

    return (
      <FieldControl {...rootProps}>
        <FieldLabel {...labelProps}>{labelProps.children || label}</FieldLabel>
        <FieldInputGroup>
          <FieldAddon placement="start" error={error}>
            {startAddon}
          </FieldAddon>
          <FieldInput {...inputProps} />
          <FieldAddon placement="end" error={error}>
            {endAddon}
          </FieldAddon>
        </FieldInputGroup>
        <FieldCaption {...captionProps}>
          {captionProps.children || caption}
        </FieldCaption>
        <FieldError {...errorProps}>
          {captionProps.children || errorMessage}
        </FieldError>
      </FieldControl>
    );
  }
);

Input.displayName = 'Input';
