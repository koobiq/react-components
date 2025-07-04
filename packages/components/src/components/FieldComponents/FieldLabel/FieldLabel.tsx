import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx, isNotNil } from '@koobiq/react-core';
import { Label } from '@koobiq/react-primitives';

import s from './FieldLabel.module.css';

export type FieldLabelProps = ExtendableComponentPropsWithRef<
  {
    isHidden?: boolean;
    className?: string;
    isRequired?: boolean;
    children?: ReactNode;
  },
  'label'
>;

export const FieldLabel = forwardRef<ComponentRef<'label'>, FieldLabelProps>(
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
        {children}&nbsp;{isRequired && <sup className={s.sup}>*</sup>}
      </Label>
    ) : null
);

FieldLabel.displayName = 'FieldLabel';
