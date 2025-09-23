import type { ComponentPropsWithRef } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Input, Textarea } from '@koobiq/react-primitives';

import s from './FormFieldInput.module.css';

export type FormFieldInputBaseProps = {
  className?: string;
  'data-testid'?: string;
  as?: 'input' | 'textarea';
};

export const FormFieldInput = polymorphicForwardRef<
  'input',
  FormFieldInputBaseProps,
  'input' | 'textarea'
>(({ as = 'input', className, ...other }, ref) => {
  const Tag = as === 'input' ? Input : Textarea;

  return <Tag {...other} className={clsx(s.base, className)} ref={ref} />;
});

FormFieldInput.displayName = 'FormFieldInput';

export type FormFieldInputProps<As extends 'input' | 'textarea' = 'input'> =
  ComponentPropsWithRef<typeof FormFieldInput<As>>;
