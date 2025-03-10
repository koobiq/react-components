'use client';

import { forwardRef, useRef } from 'react';

import { filterDOMProps } from '@koobiq/react-core';

import { useNumberField } from '../../behaviors';
import { Provider, removeDataAttributes, useRenderProps } from '../../utils';
import { ButtonContext } from '../Button';
import { GroupContext } from '../Group';
import { InputContext } from '../Input';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';

import type { NumberFieldProps, NumberFieldRef } from './index';

export const NumberField = forwardRef<NumberFieldRef, NumberFieldProps>(
  (props, ref) => {
    const { disabled, readonly, required, error } = props;

    const inputRef = useRef(null);

    const {
      labelProps,
      inputProps,
      groupProps,
      descriptionProps,
      errorMessageProps,
      incrementButtonProps,
      decrementButtonProps,
    } = useNumberField({ ...removeDataAttributes(props) }, inputRef);

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    const renderProps = useRenderProps({
      ...props,
      values: {
        error: error || false,
        disabled: disabled || false,
        readonly: readonly || false,
        required: required || false,
      },
    });

    return (
      <div
        {...DOMProps}
        {...renderProps}
        data-error={error || undefined}
        data-readonly={readonly || undefined}
        data-required={required || undefined}
        data-disabled={props.disabled || undefined}
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
          ]}
        >
          {renderProps.children}
        </Provider>
      </div>
    );
  }
);

NumberField.displayName = 'NumberField';
