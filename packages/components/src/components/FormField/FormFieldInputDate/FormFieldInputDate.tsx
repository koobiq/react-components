import { forwardRef, type ReactNode, type Ref } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './FormFieldInputDate.module.css';

export type FormFieldInputDateProps = {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  ref?: Ref<HTMLDivElement>;
};

export const FormFieldInputDate = forwardRef<
  HTMLDivElement,
  FormFieldInputDateProps
>(({ children, className, ...other }, ref) => (
  <div {...other} className={clsx(s.base, className)} ref={ref}>
    {children}
  </div>
));

FormFieldInputDate.displayName = 'FormFieldInputDate';
