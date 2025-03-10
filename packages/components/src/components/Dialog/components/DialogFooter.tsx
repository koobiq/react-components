'use client';

import { forwardRef } from 'react';
import type { ReactNode, ComponentRef } from 'react';

import { clsx } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import s from '../Dialog.module.css';

export type DialogFooterRef = ComponentRef<'div'>;

export type DialogFooterProps = ExtendableComponentPropsWithRef<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** The content of the component. */
    children?: ReactNode;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string;
  },
  'div'
>;

export const DialogFooter = forwardRef<DialogFooterRef, DialogFooterProps>(
  ({ children, className, ...other }, ref) => (
    <div ref={ref} className={clsx(s.footer, className)} {...other}>
      {children}
    </div>
  )
);

DialogFooter.displayName = 'DialogFooter';
