import { type ComponentRef, forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { useTextareaContext } from '@koobiq/react-primitives';

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldError,
  type FieldErrorProps,
  FieldInput,
  type FieldInputProps,
  FieldLabel,
  type FieldLabelProps,
} from '../../../FieldComponents';
import s from '../../Textarea.module.css';
import type { TextareaProps } from '../../types';
import { useTextareaAutosize } from '../../utils';

type TextareaContextConsumerProps = {
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
} & Pick<
  TextareaProps,
  | 'slotProps'
  | 'caption'
  | 'label'
  | 'rows'
  | 'cols'
  | 'variant'
  | 'expand'
  | 'isLabelHidden'
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
    isInvalid,
    expand,
    caption,
    variant,
    isDisabled,
    isRequired,
    slotProps,
    isLabelHidden,
    errorMessage,
  } = props;

  const { value } = useTextareaContext();

  const domRef = useDOMRef<ComponentRef<'textarea'>>(ref);

  useTextareaAutosize(domRef, value, expand === 'auto-size');

  const textareaProps = mergeProps<
    [FieldInputProps<'textarea'>, FieldInputProps<'textarea'> | undefined]
  >(
    {
      isInvalid,
      rows,
      cols,
      variant,
      value,
      isDisabled,
      ...(expand && { className: s[expand] }),
      ref: domRef,
    },
    slotProps?.textarea
  );

  const captionProps: FieldCaptionProps | undefined = mergeProps(
    { isInvalid },
    slotProps?.caption
  );

  const errorProps = mergeProps<[FieldErrorProps, FieldErrorProps | undefined]>(
    { isInvalid },
    slotProps?.errorMessage
  );

  const labelProps = mergeProps<[FieldLabelProps, FieldLabelProps | undefined]>(
    { isHidden: isLabelHidden, isRequired },
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
