import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  clsx,
  type DataAttributeProps,
  polymorphicForwardRef,
} from '@koobiq/react-core';

import s from './FieldControl.module.css';

export type FieldControlBaseProps = {
  fullWidth?: boolean;
  className?: string;
} & DataAttributeProps;

export const FieldControl = polymorphicForwardRef<'div', FieldControlBaseProps>(
  ({ fullWidth = false, className, as: Tag = 'div', ...other }, ref) => (
    <Tag
      className={clsx(s.base, fullWidth && s.fullWidth, className)}
      {...other}
      ref={ref}
    />
  )
);

export type FieldControlProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FieldControl<As>>;

FieldControl.displayName = 'FieldControl';
