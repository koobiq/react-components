'use client';

import { forwardRef, type ComponentRef } from 'react';

import { clsx } from '@koobiq/react-core';

import type { UsernamePrimaryProps } from './types';
import s from './Username.module.css';

export const UsernamePrimary = forwardRef<
  ComponentRef<'span'>,
  UsernamePrimaryProps
>(({ className, children, ...other }, ref) => (
  <span className={clsx(s.primary, className)} ref={ref} {...other}>
    {children}
  </span>
));

UsernamePrimary.displayName = 'UsernamePrimary';
