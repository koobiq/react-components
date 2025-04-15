import { forwardRef, type ReactNode } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { Button } from '@koobiq/react-primitives';

import type { InputPropVariant } from '../../Input';

import s from './FieldSelect.module.css';

export type FieldSelectProps = {
  error?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  variant?: InputPropVariant;
  placeholder?: string | number;
};

export const FieldSelect = forwardRef<HTMLButtonElement, FieldSelectProps>(
  (
    {
      error = false,
      disabled = false,
      variant = 'filled',
      placeholder,
      children,
      className,
      ...other
    },
    ref
  ) => (
    <Button
      {...other}
      disabled={disabled}
      data-slot="select-value"
      className={clsx(
        s.base,
        s[variant],
        error && s.error,
        disabled && s.disabled,
        !isNotNil(children) && s.hasPlaceholder,
        className
      )}
      ref={ref}
    >
      <span className={s.content}>{children ?? placeholder}</span>
    </Button>
  )
);

FieldSelect.displayName = 'FieldSelect';
