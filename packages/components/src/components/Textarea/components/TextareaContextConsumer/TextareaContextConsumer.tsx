import { type ComponentRef, forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';
import {
  useTextareaContext,
  FieldError,
  type FieldErrorProps,
} from '@koobiq/react-primitives';

import {
  FieldCaption,
  type FieldCaptionProps,
  FieldContentGroup,
  FieldInput,
  type FieldContentGroupProps,
  type FieldInputProps,
  Field,
} from '../../../FieldComponents';
import {
  FormControlLabel,
  type FormControlLabelProps,
} from '../../../FormControlLabel';
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
  | 'labelPlacement'
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

  const captionProps = mergeProps<
    [FieldCaptionProps, FieldCaptionProps | undefined]
  >({ children: caption }, slotProps?.caption);

  const errorProps = mergeProps<[FieldErrorProps, FieldErrorProps | undefined]>(
    { children: errorMessage, className: s.error },
    slotProps?.errorMessage
  );

  const groupProps: FieldContentGroupProps = {
    variant,
    isInvalid,
    isDisabled,
  };

  const labelProps = mergeProps<
    [FormControlLabelProps, FormControlLabelProps | undefined]
  >({ isHidden: isLabelHidden, children: label, isRequired }, slotProps?.label);

  return (
    <>
      <FormControlLabel {...labelProps} />
      <Field>
        <FieldContentGroup {...groupProps}>
          <FieldInput as="textarea" {...textareaProps} />
        </FieldContentGroup>
        <FieldCaption {...captionProps} />
        <FieldError {...errorProps} />
      </Field>
    </>
  );
});

TextareaContextConsumer.displayName = 'TextareaContextConsumer';
