import type { ComponentPropsWithRef, ElementType } from 'react';

import { polymorphicForwardRef, clsx, isNotNil } from '@koobiq/react-core';
import { Label } from '@koobiq/react-primitives';

import s from './FormControlLabel.module.css';
import type { FormControlLabelBaseProps } from './types';

export const FormControlLabel = polymorphicForwardRef<
  'label',
  FormControlLabelBaseProps
>(
  (
    { children, className, isHidden, isRequired, as = 'label', ...other },
    ref
  ) =>
    isNotNil(children) ? (
      <Label
        as={as}
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

export type FormControlLabelProps<As extends ElementType = 'label'> =
  ComponentPropsWithRef<typeof FormControlLabel<As>>;

FormControlLabel.displayName = 'FormControlLabel';
