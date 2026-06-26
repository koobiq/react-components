'use client';

import { useContext } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { EmptyStateContext } from '../../EmptyStateContext';

import s from './EmptyStateMedia.module.css';
import type { EmptyStateMediaProps } from './types';

/** EmptyState.Media — the illustration or icon slot of the EmptyState. */
export const EmptyStateMedia = polymorphicForwardRef<
  'div',
  EmptyStateMediaProps
>((props, ref) => {
  const { as: Tag = 'div', className, children, ...other } = props;

  const { size, align, isInvalid } = useContext(EmptyStateContext);

  return (
    <Tag
      {...other}
      ref={ref}
      className={clsx(s.base, s[size], isInvalid && s.invalid, className)}
      data-size={size}
      data-align={align}
      data-invalid={isInvalid || undefined}
    >
      {children}
    </Tag>
  );
});

EmptyStateMedia.displayName = 'EmptyState.Media';
