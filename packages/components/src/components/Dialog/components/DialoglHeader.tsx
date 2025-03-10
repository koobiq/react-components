'use client';

import { forwardRef } from 'react';
import type { ReactNode, ComponentRef } from 'react';

import { clsx } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../Dialog.module.css';

export type DialogHeaderRef = ComponentRef<'div'>;

export type DialogHeaderProps = ExtendableComponentPropsWithRef<
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

export const DialogHeader = forwardRef<DialogHeaderRef, DialogHeaderProps>(
  ({ children, className, ...other }, ref) => (
    <div
      ref={ref}
      className={clsx(s.header, utilClasses.typography.title, className)}
      {...other}
    >
      {children}
    </div>
  )
);

DialogHeader.displayName = 'DialogHeader';
