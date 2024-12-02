import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import type { useTextField } from '@koobiq/react-primitives';

import type { InputPropVariant } from '../../types';

import s from './FieldInput.module.css';

export type FieldInputProps = {
  error?: boolean;
  variant?: InputPropVariant;
  disabled?: boolean;
  className?: string;
} & ReturnType<typeof useTextField>['inputProps'];

export const FieldInput = polymorphicForwardRef<'input', FieldInputProps>(
  (
    {
      as: Tag = 'input',
      variant = 'filled',
      disabled = false,
      error = false,
      className,
      ...other
    },
    ref
  ) => (
    <Tag
      disabled={disabled}
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
  )
);
