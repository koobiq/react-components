import { forwardRef, type ReactNode, type Ref } from 'react';

import { clsx } from '@koobiq/react-core';

import type { FieldInputGroupPropVariant } from '../FieldContentGroup';

import s from './FieldInputDate.module.css';

export type FieldInputDateProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  ref?: Ref<HTMLDivElement>;
  variant?: FieldInputGroupPropVariant;
};

export const FieldInputDate = forwardRef<HTMLDivElement, FieldInputDateProps>(
  (
    {
      isInvalid = false,
      isDisabled = false,
      variant = 'filled',
      children,
      className,
      ...other
    },
    ref
  ) => (
    <div
      {...other}
      className={clsx(
        s.base,
        s[variant],
        isInvalid && s.invalid,
        isDisabled && s.disabled,
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  )
);

FieldInputDate.displayName = 'FieldSelect';
