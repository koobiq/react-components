'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useContext } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateTitle.module.css';
import type { EmptyStateTitleProps } from './types';

/** EmptyState.Title — the heading slot of the EmptyState. */
export const EmptyStateTitle = forwardRef<HTMLDivElement, EmptyStateTitleProps>(
  (props, ref) => {
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
  }
);

EmptyStateTitle.displayName = 'EmptyState.Title';
