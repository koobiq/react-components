'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useContext } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateActions.module.css';
import type { EmptyStateActionsProps } from './types';

/** EmptyState.Actions — the actions slot (buttons, links) of the EmptyState. */
export const EmptyStateActions = forwardRef<
  HTMLDivElement,
  EmptyStateActionsProps
>((props, ref) => {
  const { className, children, ...other } = props;

  const { size } = useContext(EmptyStateContext);

  const rootProps = mergeProps<ComponentPropsWithRef<'div'>[]>(
    { className: clsx(s.base, className) },
    other
  );

  return (
    <div {...rootProps} ref={ref} data-size={size}>
      {children}
    </div>
  );
});

EmptyStateActions.displayName = 'EmptyState.Actions';
