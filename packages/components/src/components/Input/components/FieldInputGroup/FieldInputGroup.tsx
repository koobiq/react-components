import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { clsx, type ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import s from './FieldInputGroup.module.css';

export type FieldInputGroupProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    className?: string;
  },
  'div'
>;

export const FieldInputGroup = forwardRef<
  ComponentRef<'div'>,
  FieldInputGroupProps
>(({ children, className, ...other }, ref) => (
  <div className={clsx(s.base, className)} {...other} ref={ref}>
    {children}
  </div>
));

FieldInputGroup.displayName = 'FieldInputGroup';
