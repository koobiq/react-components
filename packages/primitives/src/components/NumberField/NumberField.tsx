'use client';

import { forwardRef, useRef } from 'react';

import { filterDOMProps } from '@koobiq/react-core';
import { useLocale } from '@react-aria/i18n';
import { useNumberField } from '@react-aria/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';

import {
  Provider,
  removeDataAttributes,
  useRenderProps,
  useSlottedContext,
} from '../../utils';
import { ButtonContext } from '../Button';
import { FieldErrorContext } from '../FieldError';
import { FormContext } from '../Form';
import { GroupContext } from '../Group';
import { InputContext } from '../Input';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';

import type { NumberFieldProps, NumberFieldRef } from './index';

export const NumberField = forwardRef<NumberFieldRef, NumberFieldProps>(
  (props, ref) => {
    const { isDisabled, isReadOnly, isRequired } = props;

    const inputRef = useRef(null);

    const { locale } = useLocale();

    const { validationBehavior: formValidationBehavior } =
      useSlottedContext(FormContext) || {};

    const validationBehavior =
      props.validationBehavior ?? formValidationBehavior ?? 'native';

    const state = useNumberFieldState({ ...props, locale });

    const {
      labelProps,
      inputProps,
      groupProps,
      descriptionProps,
      errorMessageProps,
      incrementButtonProps,
      decrementButtonProps,
      ...validation
    } = useNumberField(
      { ...removeDataAttributes(props), validationBehavior },
      state,
      inputRef
    );

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    const renderProps = useRenderProps({
      ...props,
      values: {
        isInvalid: validation.isInvalid || false,
        isDisabled: isDisabled || false,
        isReadonly: isReadOnly || false,
        isRequired: isRequired || false,
      },
    });

    return (
      <Provider
        values={[
          [LabelContext, labelProps],
          [InputContext, { ...inputProps, ref: inputRef }],
          [GroupContext, groupProps],
          [
            ButtonContext,
            {
              slots: {
                increment: {
                  ...incrementButtonProps,
                  disabled: incrementButtonProps.isDisabled,
                },
                decrement: {
                  ...decrementButtonProps,
                  disabled: decrementButtonProps.isDisabled,
                },
              },
            },
          ],
          [
            TextContext,
            {
              slots: {
                description: descriptionProps,
                errorMessage: errorMessageProps,
              },
            },
          ],
          [FieldErrorContext, validation],
        ]}
      >
        <div
          {...DOMProps}
          {...renderProps}
          data-invalid={validation.isInvalid || undefined}
          data-readonly={isReadOnly || undefined}
          data-required={isRequired || undefined}
          data-disabled={isDisabled || undefined}
          ref={ref}
        />
        {props.name && (
          <input
            type="hidden"
            name={props.name}
            form={props.form}
            value={Number.isNaN(state.numberValue) ? '' : state.numberValue}
            disabled={props.isDisabled || undefined}
          />
        )}
      </Provider>
    );
  }
);

NumberField.displayName = 'NumberField';
