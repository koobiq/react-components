import type { ComponentPropsWithRef } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Input, Textarea } from '@koobiq/react-primitives';

import type { FieldInputGroupPropVariant } from '../FieldContentGroup';

import s from './FieldInput.module.css';

export type FieldInputBaseProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  'data-testid'?: string;
  as?: 'input' | 'textarea';
  variant?: FieldInputGroupPropVariant;
};

export const FieldInput = polymorphicForwardRef<
  'input',
  FieldInputBaseProps,
  'input' | 'textarea'
>(
  (
    {
      isInvalid = false,
      as = 'input',
      isDisabled = false,
      variant = 'filled',
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

FieldInput.displayName = 'FieldInput';

export type FieldInputProps<As extends 'input' | 'textarea' = 'input'> =
  ComponentPropsWithRef<typeof FieldInput<As>>;
