'use client';

import type { ReactNode, ComponentRef } from 'react';
import { forwardRef } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx } from '@koobiq/react-core';
import { useContextProps } from '@koobiq/react-primitives';

import { utilClasses } from '../../../styles/utility';
import s from '../Dialog.module.css';

import { DialogBodyContext } from './DialogBodyContext';

export type DialogBodyRef = ComponentRef<'div'>;

export type DialogBodyProps = ExtendableComponentPropsWithRef<
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

export const DialogBody = forwardRef<DialogBodyRef, DialogBodyProps>(
  ({ children, className, ...other }, ref) => {
    const [, ctxRef] = useContextProps({}, ref, DialogBodyContext);

    return (
      <div
        ref={ctxRef}
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

DialogBody.displayName = 'DialogBody';
