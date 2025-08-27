import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Field.module.css';
import type { FieldBaseProps } from './types';

export const Field = polymorphicForwardRef<'div', FieldBaseProps>(
  ({ as: Tag = 'div', className, ...other }, ref) => (
    <Tag className={clsx(s.base, className)} {...other} ref={ref} />
  )
);

export type FieldProps<As extends ElementType = 'div'> = ComponentPropsWithRef<
  typeof Field<As>
>;

Field.displayName = 'Field';
