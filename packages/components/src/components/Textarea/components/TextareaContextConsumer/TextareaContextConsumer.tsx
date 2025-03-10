import { type ComponentRef, forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { useTextareaContext } from '@koobiq/react-primitives';

import {
  FieldCaption,
  FieldError,
  FieldInput,
  FieldLabel,
} from '../../../FieldComponents';
import s from '../../Textarea.module.css';
import type { TextareaProps } from '../../types';
import { useTextareaAutosize } from '../../utils';

type TextareaContextConsumerProps = {
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
} & Pick<
  TextareaProps,
  | 'slotProps'
  | 'caption'
  | 'label'
  | 'rows'
  | 'cols'
  | 'variant'
  | 'expand'
  | 'hiddenLabel'
  | 'errorMessage'
>;

export const TextareaContextConsumer = forwardRef<
  ComponentRef<'textarea'>,
  TextareaContextConsumerProps
>((props, ref) => {
  const {
    rows,
    cols,
    label,
    error,
    expand,
    caption,
    variant,
    disabled,
    required,
    slotProps,
    hiddenLabel,
    errorMessage,
  } = props;

  const { value } = useTextareaContext();

  const domRef = useDOMRef<ComponentRef<'textarea'>>(ref);

  useTextareaAutosize(domRef, value, expand === 'auto-size');

  const textareaProps = mergeProps(
    {
      error,
      rows,
      cols,
      variant,
      value,
      disabled,
      ...(expand && { className: s[expand] }),
      ref: domRef,
    },
    slotProps?.textarea
  );

  const captionProps = slotProps?.caption;

  const errorProps = mergeProps({ error }, slotProps?.errorMessage);

  const labelProps = mergeProps(
    { hidden: hiddenLabel, required },
    slotProps?.label
  );

  return (
    <>
      <FieldLabel {...labelProps}>{labelProps.children || label}</FieldLabel>
      <FieldInput as="textarea" {...textareaProps} />
      <FieldCaption {...captionProps}>
        {captionProps?.children || caption}
      </FieldCaption>
      <FieldError {...errorProps}>
        {errorProps.children || errorMessage}
      </FieldError>
    </>
  );
});

TextareaContextConsumer.displayName = 'TextareaContextConsumer';
