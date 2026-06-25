'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useContext } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateContent.module.css';
import type { EmptyStateContentProps } from './types';

/** EmptyState.Content — the supporting text slot of the EmptyState. */
export const EmptyStateContent = forwardRef<
  HTMLDivElement,
  EmptyStateContentProps
>((props, ref) => {
  const { className, children, ...other } = props;

  const { size, state } = useContext(EmptyStateContext);

  const rootProps = mergeProps<ComponentPropsWithRef<'div'>[]>(
    { className: clsx(s.base, className) },
    other
  );

  return (
    <div {...rootProps} ref={ref} data-size={size} data-state={state}>
      {children}
    </div>
  );
});

EmptyStateContent.displayName = 'EmptyState.Content';
