import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx, isNotNil } from '@koobiq/react-core';
import { Label } from '@koobiq/react-primitives';

import s from './FormControlLabel.module.css';

export type FormControlLabelProps = ExtendableComponentPropsWithRef<
  {
    isHidden?: boolean;
    className?: string;
    isRequired?: boolean;
    children?: ReactNode;
  },
  'label'
>;

export const FormControlLabel = forwardRef<
  ComponentRef<'label'>,
  FormControlLabelProps
>(
  (
    { children, className, isHidden = false, isRequired = false, ...other },
    ref
  ) =>
    isNotNil(children) ? (
      <Label
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

FormControlLabel.displayName = 'FormControlLabel';
