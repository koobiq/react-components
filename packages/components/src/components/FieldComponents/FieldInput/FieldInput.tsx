import type { ComponentPropsWithRef } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Input, Textarea } from '@koobiq/react-primitives';

import type { InputPropVariant } from '../../Input';

import s from './FieldInput.module.css';

export type FieldInputBaseProps = {
  error?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  as?: 'input' | 'textarea';
  variant?: InputPropVariant;
};

export const FieldInput = polymorphicForwardRef<
  'input',
  FieldInputBaseProps,
  'input' | 'textarea'
>(
  (
    {
      error = false,
      as = 'input',
      disabled = false,
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
          error && s.error,
          disabled && s.disabled,
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
