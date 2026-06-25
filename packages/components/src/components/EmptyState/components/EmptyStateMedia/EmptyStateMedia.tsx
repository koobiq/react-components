'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useContext } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateMedia.module.css';
import type { EmptyStateMediaProps } from './types';

/** EmptyState.Media — the illustration or icon slot of the EmptyState. */
export const EmptyStateMedia = forwardRef<HTMLDivElement, EmptyStateMediaProps>(
  (props, ref) => {
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
  }
);

EmptyStateMedia.displayName = 'EmptyState.Media';
