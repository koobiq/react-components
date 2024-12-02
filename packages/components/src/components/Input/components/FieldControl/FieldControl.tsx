import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { clsx, type ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import s from './FieldControl.module.css';

export type FieldControlProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    fullWidth?: boolean;
    error?: boolean;
    className?: string;
  },
  'div'
>;

export const FieldControl = forwardRef<ComponentRef<'div'>, FieldControlProps>(
  ({ fullWidth = false, children, className, ...other }, ref) => (
    <div
      className={clsx(s.base, fullWidth && s.fullWidth, className)}
      {...other}
      ref={ref}
    >
      {children}
    </div>
  )
);

FieldControl.displayName = 'FieldControl';
