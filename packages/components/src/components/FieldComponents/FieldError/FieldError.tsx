import { forwardRef, type ReactNode } from 'react';

import { clsx, type ValidationResult } from '@koobiq/react-core';
import {
  FieldError as FieldErrorPrimitive,
  type TextProps,
  type TextRef,
} from '@koobiq/react-primitives';

import s from './FieldError.module.css';

export type FieldErrorProps = Omit<TextProps, 'children'> & {
  children?: ReactNode | ((v: ValidationResult) => ReactNode);
};
export type FieldErrorRef = TextRef;

export const FieldError = forwardRef<FieldErrorRef, FieldErrorProps>(
  ({ className, ...other }, ref) => (
    <FieldErrorPrimitive
      className={clsx(s.base, className)}
      {...other}
      ref={ref}
    />
  )
);

FieldError.displayName = 'FieldError';
