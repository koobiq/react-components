'use client';

import { forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps } from '@koobiq/react-core';
import { TextField } from '@koobiq/react-primitives';

import { FormField, type FormFieldProps } from '../FormField';

import { TextareaContextConsumer } from './components';
import type { TextareaProps, TextareaRef } from './index';

export const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
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
    labelPlacement,
    labelAlign,
    rows,
    cols,
    expand,
    errorMessage,
    slotProps,
    caption,
    label,
    ...other
  } = props;

  const isDisabled = isDisabledProp ?? disabled;
  const isRequired = isRequiredProp ?? required;
  const isReadOnly = isReadOnlyProp ?? readonly;
  const isInvalid = isInvalidProp ?? error;
  const isLabelHidden = isLabelHiddenProp ?? hiddenLabel;

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'Textarea: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'required' in props) {
    deprecate(
      'Textarea: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'error' in props) {
    deprecate(
      'Textarea: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
    deprecate(
      'Textarea: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'hiddenLabel' in props) {
    deprecate(
      'Textarea: the "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.'
    );
  }

  const rootProps = mergeProps<
    (FormFieldProps<typeof TextField<HTMLTextAreaElement>> | undefined)[]
  >(
    {
      label,
      fullWidth,
      isDisabled,
      isRequired,
      isReadOnly,
      isInvalid,
      errorMessage,
      labelPlacement,
      labelAlign,
      'data-variant': variant,
    },
    other
  );

  return (
    <FormField as={TextField} inputElementType="textarea" {...rootProps}>
      {(values) => (
        <TextareaContextConsumer
          {...values}
          rows={rows}
          cols={cols}
          label={label}
          expand={expand}
          variant={variant}
          caption={caption}
          slotProps={slotProps}
          isLabelHidden={isLabelHidden}
          errorMessage={errorMessage}
          ref={ref}
        />
      )}
    </FormField>
  );
});

Textarea.displayName = 'Textarea';
