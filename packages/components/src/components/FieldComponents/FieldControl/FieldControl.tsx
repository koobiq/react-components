import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import type { TextFieldProps, TextFieldRef } from '@koobiq/react-primitives';
import { TextField } from '@koobiq/react-primitives';

import s from './FieldControl.module.css';

export type FieldControlProps = TextFieldProps & {
  fullWidth?: boolean;
  className?: string;
};

export type FieldControlRef = TextFieldRef;

export const FieldControl = forwardRef<FieldControlRef, FieldControlProps>(
  ({ fullWidth = false, children, className, ...other }, ref) => (
    <TextField
      className={clsx(s.base, fullWidth && s.fullWidth, className)}
      {...other}
      ref={ref}
    >
      {children}
    </TextField>
  )
);

FieldControl.displayName = 'FieldControl';
