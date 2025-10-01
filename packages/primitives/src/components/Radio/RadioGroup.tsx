'use client';

import { forwardRef } from 'react';
import type { ComponentRef } from 'react';

import { filterDOMProps } from '@koobiq/react-core';

import { useRadioGroup, useRadioGroupState } from '../../behaviors';
import {
  useRenderProps,
  Provider,
  removeDataAttributes,
  useSlottedContext,
} from '../../utils';
import { FieldErrorContext } from '../FieldError';
import { FormContext } from '../Form';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';

import { RadioContext } from './index';
import type { RadioGroupProps } from './index';

export const RadioGroup = forwardRef<ComponentRef<'div'>, RadioGroupProps>(
  (props, ref) => {
    const state = useRadioGroupState(props);

    const { validationBehavior: formValidationBehavior } =
      useSlottedContext(FormContext) || {};

    const validationBehavior =
      props.validationBehavior ?? formValidationBehavior ?? 'aria';

    const {
      radioGroupProps,
      labelProps,
      descriptionProps,
      errorMessageProps,
      ...validation
    } = useRadioGroup(
      { ...removeDataAttributes(props), validationBehavior },
      state
    );

    const renderProps = useRenderProps({
      ...props,
      values: {
        orientation: props.orientation || 'vertical',
        isDisabled: state.isDisabled,
        isReadOnly: state.isReadOnly,
        isRequired: state.isRequired,
        isInvalid: state.isInvalid,
        state,
      },
    });

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <div
        {...DOMProps}
        data-invalid={validation.isInvalid || undefined}
        data-readonly={state.isReadOnly || undefined}
        data-required={state.isRequired || undefined}
        data-disabled={state.isDisabled || undefined}
        {...radioGroupProps}
        {...renderProps}
        ref={ref}
      >
        <Provider
          values={[
            [RadioContext, state],
            [LabelContext, labelProps],
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

RadioGroup.displayName = 'RadioGroup';
