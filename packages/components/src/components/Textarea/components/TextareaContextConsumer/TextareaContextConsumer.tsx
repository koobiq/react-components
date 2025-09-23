import { type ComponentRef, forwardRef } from 'react';

import { mergeProps, useDOMRef } from '@koobiq/react-core';
import { useTextareaContext } from '@koobiq/react-primitives';

import type {
  FormFieldLabelProps,
  FormFieldInputProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
} from '../../../FormField';
import { FormField } from '../../../FormField';
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
    [
      FormFieldInputProps<'textarea'>,
      FormFieldInputProps<'textarea'> | undefined,
    ]
  >(
    {
      rows,
      cols,
      value,
      ...(expand && { className: s[expand] }),
      ref: domRef,
    },
    slotProps?.textarea
  );

  const captionProps = mergeProps<
    [FormFieldCaptionProps, FormFieldCaptionProps | undefined]
  >({ children: caption }, slotProps?.caption);

  const errorProps = mergeProps<
    [FormFieldErrorProps, FormFieldErrorProps | undefined]
  >({ children: errorMessage }, slotProps?.errorMessage);

  const groupProps: FormFieldControlGroupProps = {
    variant,
    isInvalid,
    isDisabled,
  };

  const labelProps = mergeProps<
    [FormFieldLabelProps, FormFieldLabelProps | undefined]
  >({ isHidden: isLabelHidden, children: label, isRequired }, slotProps?.label);

  return (
    <>
      <FormField.Label {...labelProps} />
      <div className={s.body}>
        <FormField.ControlGroup {...groupProps}>
          <FormField.Input as="textarea" {...textareaProps} />
        </FormField.ControlGroup>
        <FormField.Caption {...captionProps} />
        <FormField.Error {...errorProps} />
      </div>
    </>
  );
});

TextareaContextConsumer.displayName = 'TextareaContextConsumer';
