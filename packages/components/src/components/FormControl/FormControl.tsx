import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './FormControl.module.css';
import type { FormControlBaseProps } from './types';

export const FormControl = polymorphicForwardRef<'div', FormControlBaseProps>(
  (
    {
      labelPlacement = 'top',
      labelAlign = 'start',
      fullWidth = false,
      as: Tag = 'div',
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
      data-fullwidth={fullWidth}
      data-label-align={labelAlign}
      data-label-placement={labelPlacement}
      {...other}
      ref={ref}
    />
  )
);

export type FormControlProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormControl<As>>;

FormControl.displayName = 'FormControl';
