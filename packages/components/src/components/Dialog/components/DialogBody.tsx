'use client';

import type { ReactNode, ComponentRef } from 'react';
import { forwardRef, useContext, createContext } from 'react';

import {
  clsx,
  type ExtendableComponentPropsWithRef,
  mergeProps,
  useMultiRef,
} from '@koobiq/react-core';

import { utilClasses } from '../../../styles/utility';
import s from '../Dialog.module.css';

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

export const DialogBodyContext = createContext<DialogBodyProps>({});

export const DialogBody = forwardRef<DialogBodyRef, DialogBodyProps>(
  ({ children, className, ...other }, ref) => {
    const defaultProps = useContext(DialogBodyContext);
    const { ref: contextRef } = mergeProps(defaultProps, other);

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

DialogBody.displayName = 'DialogBody';
