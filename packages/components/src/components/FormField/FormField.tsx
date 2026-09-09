'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { useForm } from '../Form';

import s from './FormField.module.css';
import { FormFieldCaption } from './FormFieldCaption';
import { FormFieldControlGroup } from './FormFieldControlGroup';
import { FormFieldError } from './FormFieldError';
import { FormFieldInput } from './FormFieldInput';
import { FormFieldInputDate } from './FormFieldInputDate';
import { FormFieldLabel } from './FormFieldLabel';
import { FormFieldSelect } from './FormFieldSelect';
import type { FormFieldBaseProps } from './types';

export const FormFieldComponent = polymorphicForwardRef<
  'div',
  FormFieldBaseProps
>((props, ref) => {
  const {
    as: Tag = 'div',
    fullWidth,
    className,
    labelAlign: labelAlignProp,
    labelPlacement: labelPlacementProp,
    ...other
  } = props;

  const { labelPlacement: formLabelPlacement, labelAlign: formLabelAlign } =
    useForm();

  const labelPlacement = labelPlacementProp ?? formLabelPlacement ?? 'top';

  const labelAlign = labelAlignProp ?? formLabelAlign ?? 'start';

  return (
    <Tag
      className={clsx(
        s.base,
        className,
        s[labelAlign],
        s[labelPlacement],
        fullWidth && s.fullWidth
      )}
      data-slot="form-field"
      data-label-align={labelAlign}
      data-label-placement={labelPlacement}
      data-fullwidth={fullWidth || undefined}
      {...other}
      ref={ref}
    />
  );
});

FormFieldComponent.displayName = 'FormField';

export const FormField = Object.assign(FormFieldComponent, {
  Label: FormFieldLabel,
  Error: FormFieldError,
  Caption: FormFieldCaption,
  ControlGroup: FormFieldControlGroup,
  Input: FormFieldInput,
  InputDate: FormFieldInputDate,
  Select: FormFieldSelect,
});

export type FormFieldProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormField<As>>;
