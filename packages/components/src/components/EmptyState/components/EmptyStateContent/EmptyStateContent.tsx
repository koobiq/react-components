'use client';

import { useContext } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateContent.module.css';
import type { EmptyStateContentProps } from './types';

/** EmptyState.Content — the supporting text slot of the EmptyState. */
export const EmptyStateContent = polymorphicForwardRef<
  'p',
  EmptyStateContentProps
>((props, ref) => {
  const { as: Tag = 'p', className, children, ...other } = props;

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

EmptyStateContent.displayName = 'EmptyState.Content';
