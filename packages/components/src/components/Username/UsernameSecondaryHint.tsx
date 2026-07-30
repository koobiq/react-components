'use client';

import { forwardRef, type ComponentRef } from 'react';

import { clsx } from '@koobiq/react-core';

import type { UsernameSecondaryHintProps } from './types';
import s from './Username.module.css';

export const UsernameSecondaryHint = forwardRef<
  ComponentRef<'span'>,
  UsernameSecondaryHintProps
>(({ className, children, ...other }, ref) => (
  <span className={clsx(s.secondaryHint, className)} ref={ref} {...other}>
    {children}
  </span>
));

UsernameSecondaryHint.displayName = 'UsernameSecondaryHint';
