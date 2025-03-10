import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  NumberField,
  type NumberFieldProps,
  type NumberFieldRef,
} from '@koobiq/react-primitives';

import s from './FieldNumberControl.module.css';

export type FieldNumberControlProps = NumberFieldProps & {
  fullWidth?: boolean;
  className?: string;
};

export type FieldNumberControlRef = NumberFieldRef;

export const FieldNumberControl = forwardRef<
  FieldNumberControlRef,
  FieldNumberControlProps
>(({ fullWidth = false, children, className, ...other }, ref) => (
  <NumberField
    className={clsx(s.base, fullWidth && s.fullWidth, className)}
    {...other}
    ref={ref}
  >
    {children}
  </NumberField>
));

FieldNumberControl.displayName = 'FieldNumberControl';
