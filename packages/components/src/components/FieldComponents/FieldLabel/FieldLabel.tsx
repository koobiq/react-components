import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx, isNotNil } from '@koobiq/react-core';
import { Label } from '@koobiq/react-primitives';

import s from './FieldLabel.module.css';

export type FieldLabelProps = ExtendableComponentPropsWithRef<
  {
    hidden?: boolean;
    className?: string;
    required?: boolean;
    children?: ReactNode;
  },
  'label'
>;

export const FieldLabel = forwardRef<ComponentRef<'label'>, FieldLabelProps>(
  ({ children, className, hidden = false, required = false, ...other }, ref) =>
    isNotNil(children) ? (
      <Label
        className={clsx(s.base, hidden && s.hidden, className)}
        {...other}
        ref={ref}
      >
        {children}&nbsp;{required && <sup className={s.sup}>*</sup>}
      </Label>
    ) : null
);

FieldLabel.displayName = 'FieldLabel';
