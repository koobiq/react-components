'use client';

import { type ComponentRef, forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { NumberField } from '@koobiq/react-primitives';

import {
  FieldInput,
  FormControlLabel,
  FieldError,
  FieldCaption,
  FieldContentGroup,
  FormControl,
  type FormControlProps,
  type FormControlLabelProps,
  type FieldCaptionProps,
  type FieldErrorProps,
  type FieldContentGroupProps,
  type FieldInputProps,
  Field,
} from '../FieldComponents';

import { InputNumberCounterControls } from './components';
import type { InputNumberProps, InputNumberRef } from './index';

export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(
  (props, ref) => {
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
      labelAlign,
      labelPlacement,
      startAddon,
      endAddon,
      errorMessage,
      slotProps,
      caption,
      ...other
    } = props;

    const inputRef = useDOMRef<ComponentRef<'input'>>(ref);

    const isDisabled = isDisabledProp ?? disabled ?? false;
    const isRequired = isRequiredProp ?? required ?? false;
    const isReadOnly = isReadOnlyProp ?? readonly ?? false;
    const isInvalid = isInvalidProp ?? error ?? false;
    const isLabelHidden = isLabelHiddenProp ?? hiddenLabel ?? false;

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'InputNumber: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'required' in props) {
      deprecate(
        'InputNumber: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'error' in props) {
      deprecate(
        'InputNumber: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
      deprecate(
        'InputNumber: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'hiddenLabel' in props) {
      deprecate(
        'InputNumber: the "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.'
      );
    }

    const rootProps = mergeProps<
      [
        FormControlProps<typeof NumberField>,
        FormControlProps<typeof NumberField> | undefined,
      ]
    >(
      {
        label,
        labelAlign,
        labelPlacement,
        fullWidth,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        errorMessage,
        'data-variant': variant,
        ...other,
      },
      slotProps?.root
    );

    return (
      <FormControl as={NumberField} {...rootProps}>
        {({ isInvalid, isRequired, isDisabled }) => {
          const labelProps = mergeProps<
            [FormControlLabelProps, FormControlLabelProps | undefined]
          >(
            { isHidden: isLabelHidden, children: label, isRequired },
            slotProps?.label
          );

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

          const captionProps: FieldCaptionProps | undefined = mergeProps<
            [FieldCaptionProps, FieldCaptionProps | undefined]
          >({ children: caption }, slotProps?.caption);

          const errorProps = mergeProps<
            [FieldErrorProps, FieldErrorProps | undefined]
          >({ isInvalid, children: errorMessage }, slotProps?.errorMessage);

          const groupProps = mergeProps<
            [FieldContentGroupProps, FieldContentGroupProps | undefined]
          >(
            {
              endAddon: (
                <>
                  {endAddon}
                  <InputNumberCounterControls />
                </>
              ),
              isInvalid,
              variant,
              startAddon,
              isDisabled,
            },
            slotProps?.group
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
  }
);

InputNumber.displayName = 'InputNumber';
