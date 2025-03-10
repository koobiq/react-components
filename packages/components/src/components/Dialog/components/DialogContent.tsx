'use client';

import { forwardRef } from 'react';
import type { ReactNode, ComponentRef } from 'react';

import {
  clsx,
  type ExtendableComponentPropsWithRef,
  useMultiRef,
} from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../Dialog.module.css';
import { useDialogProvider } from '../DialogContext';

export type DialogContentRef = ComponentRef<'div'>;

export type DialogContentProps = ExtendableComponentPropsWithRef<
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

export const DialogContent = forwardRef<DialogContentRef, DialogContentProps>(
  ({ children, className, ...other }, ref) => {
    const { slots } = useDialogProvider();

    const { content: { ref: contextRef } = {} } = slots || {};

    return (
      <div
        ref={useMultiRef([ref, contextRef])}
        className={clsx(
          s.content,
          utilClasses.typography['text-normal'],
          className
        )}
        {...other}
      >
        {children}
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';
