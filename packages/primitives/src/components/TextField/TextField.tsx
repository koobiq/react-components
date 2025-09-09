'use client';

import { forwardRef, type Ref, useRef } from 'react';

import { filterDOMProps } from '@koobiq/react-core';
import { useTextField } from '@react-aria/textfield';

import { Provider, removeDataAttributes, useRenderProps } from '../../utils';
import { FieldErrorContext } from '../FieldError';
import { InputContext } from '../Input';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';
import { TextareaContext } from '../Textarea';

import type {
  TextFieldComponentProps,
  TextFieldProps,
  TextFieldRef,
} from './index';

function TextFieldRender(
  props: Omit<TextFieldProps<HTMLInputElement | HTMLTextAreaElement>, 'ref'>,
  ref: Ref<TextFieldRef>
) {
  const { isDisabled, isReadOnly, isRequired } = props;

  const inputRef = useRef(null);

  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useTextField<'input' | 'textarea'>(
    {
      ...removeDataAttributes(props),
    },
    inputRef
  );

  const DOMProps = filterDOMProps(props);
  delete DOMProps.id;

  const renderProps = useRenderProps({
    ...props,
    values: {
      isInvalid: validation.isInvalid || false,
      isDisabled: isDisabled || false,
      isReadOnly: isReadOnly || false,
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
          [TextareaContext, { ...inputProps, ref: inputRef }],
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

export const TextField = forwardRef(TextFieldRender) as TextFieldComponentProps;
