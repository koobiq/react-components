import { forwardRef, type ReactNode, type Ref } from 'react';

import { clsx } from '@koobiq/react-core';

import type { FormFieldControlGroupPropVariant } from '../FormFieldControlGroup';

import s from './FormFieldInputDate.module.css';

export type FormFieldInputDateProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  ref?: Ref<HTMLDivElement>;
  variant?: FormFieldControlGroupPropVariant;
};

export const FormFieldInputDate = forwardRef<
  HTMLDivElement,
  FormFieldInputDateProps
>(
  (
    {
      variant = 'filled',
      isInvalid,
      isDisabled,
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

FormFieldInputDate.displayName = 'FormFieldInputDate';
