import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { Text, type TextProps, type TextRef } from '@koobiq/react-primitives';

import s from './FieldError.module.css';

export type FieldErrorProps = TextProps & { error?: boolean };
export type FieldErrorRef = TextRef;

export const FieldError = forwardRef<FieldErrorRef, FieldErrorProps>(
  ({ children, className, error = false, ...other }, ref) =>
    isNotNil(children) && error ? (
      <Text
        className={clsx(s.base, className)}
        slot="errorMessage"
        {...other}
        ref={ref}
      >
        {children}
      </Text>
    ) : null
);

FieldError.displayName = 'FieldError';
