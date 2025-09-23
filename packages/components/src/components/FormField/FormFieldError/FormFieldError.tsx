import { forwardRef, type ReactNode } from 'react';

import { clsx, type ValidationResult } from '@koobiq/react-core';
import {
  FieldError as FieldErrorPrimitive,
  type TextProps,
  type TextRef,
} from '@koobiq/react-primitives';

import s from './FormFieldError.module.css';

export type FormFieldErrorProps = Omit<TextProps, 'children'> & {
  children?: ReactNode | ((v: ValidationResult) => ReactNode);
};
export type FormFieldErrorRef = TextRef;

export const FormFieldError = forwardRef<
  FormFieldErrorRef,
  FormFieldErrorProps
>(({ className, ...other }, ref) => (
  <FieldErrorPrimitive
    className={clsx(s.base, className)}
    {...other}
    ref={ref}
  />
));

FormFieldError.displayName = 'FormFieldError';
