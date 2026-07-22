'use client';

import { forwardRef, type ComponentRef } from 'react';

import { clsx } from '@koobiq/react-core';

import type { UsernameSecondaryProps } from './types';
import s from './Username.module.css';

export const UsernameSecondary = forwardRef<
  ComponentRef<'span'>,
  UsernameSecondaryProps
>(({ className, children, ...other }, ref) => (
  <span className={clsx(s.secondary, className)} ref={ref} {...other}>
    {children}
  </span>
));

UsernameSecondary.displayName = 'UsernameSecondary';
