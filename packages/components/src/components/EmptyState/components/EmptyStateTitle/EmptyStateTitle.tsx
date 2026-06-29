'use client';

import { useContext } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateTitle.module.css';
import type { EmptyStateTitleProps } from './types';

/** EmptyState.Title — the heading slot of the EmptyState. */
export const EmptyStateTitle = polymorphicForwardRef<
  'h3',
  EmptyStateTitleProps
>((props, ref) => {
  const { as: Tag = 'h3', className, children, ...other } = props;

  const { size, isInvalid } = useContext(EmptyStateContext);

  return (
    <Tag
      {...other}
      ref={ref}
      className={clsx(s.base, s[size], isInvalid && s.invalid, className)}
      data-size={size}
      data-invalid={isInvalid || undefined}
    >
      {children}
    </Tag>
  );
});

EmptyStateTitle.displayName = 'EmptyState.Title';
