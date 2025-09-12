import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './FormControl.module.css';
import type { FormControlBaseProps } from './types';

export const FormControl = polymorphicForwardRef<'div', FormControlBaseProps>(
  (
    {
      labelPlacement = 'top',
      labelAlign = 'start',
      as: Tag = 'div',
      fullWidth,
      className,
      ...other
    },
    ref
  ) => (
    <Tag
      className={clsx(
        s.base,
        className,
        s[labelAlign],
        s[labelPlacement],
        fullWidth && s.fullWidth
      )}
      data-label-align={labelAlign}
      data-label-placement={labelPlacement}
      data-fullwidth={fullWidth || undefined}
      {...other}
      ref={ref}
    />
  )
);

export type FormControlProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormControl<As>>;

FormControl.displayName = 'FormControl';
