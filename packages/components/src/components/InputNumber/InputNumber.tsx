'use client';

import { type ComponentRef, forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { NumberField } from '@koobiq/react-primitives';

import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldInputProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../FormField';
import { FormField } from '../FormField';

import { InputNumberCounterControls } from './components';
import type { InputNumberProps, InputNumberRef } from './index';
import s from './InputNumber.module.css';

export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(
  (props, ref) => {
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

    const isDisabled = isDisabledProp ?? disabled;
    const isRequired = isRequiredProp ?? required;
    const isReadOnly = isReadOnlyProp ?? readonly;
    const isInvalid = isInvalidProp ?? error;
    const isLabelHidden = isLabelHiddenProp ?? hiddenLabel;

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
        FormFieldProps<typeof NumberField>,
        FormFieldProps<typeof NumberField> | undefined,
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
      <FormField as={NumberField} {...rootProps}>
        {({ isInvalid, isRequired, isDisabled }) => {
          const labelProps = mergeProps<
            [FormFieldLabelProps, FormFieldLabelProps | undefined]
          >(
            { isHidden: isLabelHidden, children: label, isRequired },
            slotProps?.label
          );

          const inputProps = mergeProps<
            [
              FormFieldInputProps<'input'>,
              FormFieldInputProps<'input'> | undefined,
            ]
          >(
            {
              ref: inputRef,
            },
            slotProps?.input
          );

          const captionProps: FormFieldCaptionProps | undefined = mergeProps<
            [FormFieldCaptionProps, FormFieldCaptionProps | undefined]
          >({ children: caption }, slotProps?.caption);

          const errorProps = mergeProps<
            [FormFieldErrorProps, FormFieldErrorProps | undefined]
          >({ children: errorMessage }, slotProps?.errorMessage);

          const groupProps = mergeProps<
            [FormFieldControlGroupProps, FormFieldControlGroupProps | undefined]
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
  }
);

InputNumber.displayName = 'InputNumber';
