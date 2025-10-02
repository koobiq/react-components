import type { ComponentPropsWithRef, ElementType } from 'react';

import { polymorphicForwardRef, clsx, isNotNil } from '@koobiq/react-core';
import { Label } from '@koobiq/react-primitives';

import s from './FormFieldLabel.module.css';
import type { FormFieldLabelBaseProps } from './types';

export const FormFieldLabel = polymorphicForwardRef<
  'label',
  FormFieldLabelBaseProps
>(
  (
    { children, className, isHidden, isRequired, as = 'label', ...other },
    ref
  ) =>
    isNotNil(children) ? (
      <Label
        as={as}
        data-slot="form-field-label"
        className={clsx(s.base, isHidden && s.hidden, className)}
        {...other}
        ref={ref}
      >
        {children}
        {isRequired && (
          <>
            &nbsp;<sup className={s.sup}>*</sup>
          </>
        )}
      </Label>
    ) : null
);

export type FormFieldLabelProps<As extends ElementType = 'label'> =
  ComponentPropsWithRef<typeof FormFieldLabel<As>>;

FormFieldLabel.displayName = 'FormFieldLabel';
