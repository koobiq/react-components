import type { ComponentPropsWithRef } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Input, Textarea } from '@koobiq/react-primitives';

import type { FormFieldControlGroupPropVariant } from '../FormFieldControlGroup';

import s from './FormFieldInput.module.css';

export type FormFieldInputBaseProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  'data-testid'?: string;
  as?: 'input' | 'textarea';
  variant?: FormFieldControlGroupPropVariant;
};

export const FormFieldInput = polymorphicForwardRef<
  'input',
  FormFieldInputBaseProps,
  'input' | 'textarea'
>(
  (
    {
      variant = 'filled',
      as = 'input',
      isInvalid,
      isDisabled,
      className,
      ...other
    },
    ref
  ) => {
    const Tag = as === 'input' ? Input : Textarea;

    return (
      <Tag
        {...other}
        className={clsx(
          s.base,
          s[variant],
          isInvalid && s.invalid,
          isDisabled && s.disabled,
          className
        )}
        ref={ref}
      />
    );
  }
);

FormFieldInput.displayName = 'FormFieldInput';

export type FormFieldInputProps<As extends 'input' | 'textarea' = 'input'> =
  ComponentPropsWithRef<typeof FormFieldInput<As>>;
