'use client';

import { type ComponentRef, forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';

import {
  FieldInput,
  FieldLabel,
  FieldError,
  FieldCaption,
  FieldInputGroup,
  FieldNumberControl,
  type FieldNumberControlProps,
} from '../FieldComponents';

import { InputNumberCounterControls } from './components';
import type { InputNumberProps, InputNumberRef } from './index';

export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(
  (props, ref) => {
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

    const domRef = useDOMRef<ComponentRef<'input'>>(ref);

    const rootProps: FieldNumberControlProps = mergeProps(
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
      <FieldNumberControl {...rootProps}>
        {({ error, required, disabled }) => {
          const labelProps = mergeProps(
            { hidden: hiddenLabel, required },
            slotProps?.label
          );

          const inputProps = mergeProps(
            { error, variant, disabled, ref: domRef },
            slotProps?.input
          );

          const captionProps = slotProps?.caption;
          const errorProps = mergeProps({ error }, slotProps?.errorMessage);

          return (
            <>
              <FieldLabel {...labelProps}>
                {labelProps?.children || label}
              </FieldLabel>
              <FieldInputGroup
                error={error}
                disabled={disabled}
                startAddon={startAddon}
                endAddon={
                  <>
                    {endAddon}
                    <InputNumberCounterControls />
                  </>
                }
              >
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
      </FieldNumberControl>
    );
  }
);

InputNumber.displayName = 'InputNumber';
