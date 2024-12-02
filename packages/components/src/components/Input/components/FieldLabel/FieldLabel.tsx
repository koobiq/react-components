import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx, isNotNil } from '@koobiq/react-core';

import s from './FieldLabel.module.css';

export type FieldLabelProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    className?: string;
    hiddenLabel?: boolean;
    required?: boolean;
  },
  'label'
>;

export const FieldLabel = forwardRef<ComponentRef<'label'>, FieldLabelProps>(
  (
    { children, className, hiddenLabel = false, required = false, ...other },
    ref
  ) =>
    isNotNil(children) ? (
      <label
        className={clsx(s.base, hiddenLabel && s.hiddenLabel, className)}
        {...other}
        ref={ref}
      >
        {children}&nbsp;{required && <sup className={s.sup}>*</sup>}
      </label>
    ) : null
);

FieldLabel.displayName = 'FieldLabel';
