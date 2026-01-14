'use client';

import { forwardRef, useRef, useCallback } from 'react';
import type { Ref, KeyboardEvent } from 'react';

import {
  filterDOMProps,
  useControlledState,
  useIsomorphicEffect,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { useTextField } from '@react-aria/textfield';

import {
  Provider,
  useRenderProps,
  useSlottedContext,
  removeDataAttributes,
  DEFAULT_SLOT,
} from '../../utils';
import { ButtonContext } from '../Button';
import { FieldErrorContext } from '../FieldError';
import { FormContext } from '../Form';
import { InputContext } from '../Input';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';
import { TextareaContext } from '../Textarea';

import type {
  TextFieldRef,
  TextFieldProps,
  TextFieldComponentProps,
} from './index';
import intlMessages from './intl.json';

function TextFieldRender(
  props: Omit<TextFieldProps<HTMLInputElement | HTMLTextAreaElement>, 'ref'>,
  ref: Ref<TextFieldRef>
) {
  const { isDisabled, isReadOnly, isRequired, onClear, isClearable } = props;
  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? '',
    props?.onChange
  );

  const setValue = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');

    onClear?.();
    inputRef?.current?.focus();
  }, [setInputValue, onClear]);

  useIsomorphicEffect(() => {
    if (!inputRef.current) return;

    setInputValue(inputRef.current.value);
  }, [inputRef.current]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === 'Escape' &&
        inputValue &&
        (isClearable || onClear) &&
        !isReadOnly
      ) {
        setInputValue('');
        onClear?.();
      }
    },
    [inputValue, setInputValue, onClear, isClearable, isReadOnly]
  );

  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};

  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'aria';

  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useTextField<'input' | 'textarea'>(
    {
      ...removeDataAttributes(props),
      value: inputValue,
      onKeyDown: (e) => {
        props?.onKeyDown?.(e);
        handleKeyDown(e);
      },
      onChange: setInputValue,
      validationBehavior,
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
      state: {
        value: inputValue,
        set: setValue,
      },
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
                [DEFAULT_SLOT]: {},
                description: descriptionProps,
                errorMessage: errorMessageProps,
              },
            },
          ],
          [
            ButtonContext,
            {
              slots: {
                [DEFAULT_SLOT]: {},
                'clear-button': {
                  'aria-label': stringFormatter.format('clear'),
                  preventFocusOnPress: true,
                  onPress: handleClear,
                  tabIndex: -1,
                },
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
