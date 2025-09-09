'use client';

import { forwardRef, useRef } from 'react';

import { filterDOMProps } from '@koobiq/react-core';

import { useNumberField } from '../../behaviors';
import { Provider, removeDataAttributes, useRenderProps } from '../../utils';
import { ButtonContext } from '../Button';
import { FieldErrorContext } from '../FieldError';
import { GroupContext } from '../Group';
import { InputContext } from '../Input';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';

import type { NumberFieldProps, NumberFieldRef } from './index';

export const NumberField = forwardRef<NumberFieldRef, NumberFieldProps>(
  (props, ref) => {
    const { isDisabled, isReadOnly, isRequired } = props;

    const inputRef = useRef(null);

    const {
      labelProps,
      inputProps,
      groupProps,
      descriptionProps,
      errorMessageProps,
      incrementButtonProps,
      decrementButtonProps,
      ...validation
    } = useNumberField({ ...removeDataAttributes(props) }, inputRef);

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
      <div
        {...DOMProps}
        {...renderProps}
        data-invalid={validation.isInvalid || undefined}
        data-readonly={isReadOnly || undefined}
        data-required={isRequired || undefined}
        data-disabled={isDisabled || undefined}
        ref={ref}
      >
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
          {renderProps.children}
        </Provider>
      </div>
    );
  }
);

NumberField.displayName = 'NumberField';
