'use client';

import { forwardRef, useRef } from 'react';

import { filterDOMProps } from '@koobiq/react-core';

import { useTextField } from '../../behaviors';
import { Provider, removeDataAttributes, useRenderProps } from '../../utils';
import { InputContext } from '../Input';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';
import { TextareaContext } from '../Textarea';

import type { TextFieldProps, TextFieldRef } from './index';

export const TextField = forwardRef<TextFieldRef, TextFieldProps>(
  (props, ref) => {
    const { disabled, readonly, required } = props;

    const inputRef = useRef(null);

    const {
      error,
      labelProps,
      inputProps,
      descriptionProps,
      errorMessageProps,
    } = useTextField({ ...removeDataAttributes(props) }, inputRef);

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
            [TextareaContext, inputProps],
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

TextField.displayName = 'TextField';
