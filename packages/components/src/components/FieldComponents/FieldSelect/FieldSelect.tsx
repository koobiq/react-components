import { forwardRef, type ReactNode, type Ref } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { Button } from '@koobiq/react-primitives';

import type { InputPropVariant } from '../../Input';

import s from './FieldSelect.module.css';

export type FieldSelectProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  variant?: InputPropVariant;
  placeholder?: string | number;
  ref?: Ref<HTMLButtonElement>;
};

export const FieldSelect = forwardRef<HTMLButtonElement, FieldSelectProps>(
  (
    {
      isInvalid = false,
      isDisabled = false,
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
      isDisabled={isDisabled}
      data-slot="select-value"
      className={clsx(
        s.base,
        s[variant],
        isInvalid && s.invalid,
        isDisabled && s.disabled,
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
