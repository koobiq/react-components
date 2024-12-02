import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { isNotNil } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import s from './FieldCaption.module.css';

export type FieldCaptionProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
  },
  'div'
>;

export const FieldCaption = forwardRef<ComponentRef<'div'>, FieldCaptionProps>(
  ({ children, ...other }, ref) =>
    isNotNil(children) ? (
      <div className={s.base} {...other} ref={ref}>
        {children}
      </div>
    ) : null
);

FieldCaption.displayName = 'FieldCaption';
