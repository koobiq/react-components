import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { isNotNil } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import s from './FieldError.module.css';

export type FieldErrorProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    error?: boolean;
  },
  'div'
>;

export const FieldError = forwardRef<ComponentRef<'div'>, FieldErrorProps>(
  ({ children, error = false, ...other }, ref) =>
    isNotNil(children) && error ? (
      <div className={s.base} {...other} ref={ref}>
        {children}
      </div>
    ) : null
);

FieldError.displayName = 'FieldError';
