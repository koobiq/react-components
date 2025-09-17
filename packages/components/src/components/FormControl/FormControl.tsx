import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { useForm } from '../Form';

import s from './FormControl.module.css';
import type { FormControlBaseProps } from './types';

export const FormControl = polymorphicForwardRef<'div', FormControlBaseProps>(
  (props, ref) => {
    const { as: Tag = 'div', fullWidth, className, ...other } = props;

    const { labelPlacement: formLabelPlacement, labelAlign: formLabelAlign } =
      useForm();

    const labelPlacement = props.labelPlacement ?? formLabelPlacement ?? 'top';

    const labelAlign = props.labelAlign ?? formLabelAlign ?? 'start';

    return (
      <Tag
        className={clsx(
          s.base,
          className,
          s[labelAlign],
          s[labelPlacement],
          fullWidth && s.fullWidth
        )}
        data-slot="form-control"
        data-label-align={labelAlign}
        data-label-placement={labelPlacement}
        data-fullwidth={fullWidth || undefined}
        {...other}
        ref={ref}
      />
    );
  }
);

export type FormControlProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormControl<As>>;

FormControl.displayName = 'FormControl';
