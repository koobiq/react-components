'use client';

import type { ComponentRef, ComponentPropsWithRef } from 'react';
import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './InlineEdit.module.css';

export type InlineEditPlaceholderProps = ComponentPropsWithRef<'span'>;

export const InlineEditPlaceholder = forwardRef<
  ComponentRef<'span'>,
  InlineEditPlaceholderProps
>(({ className, ...props }, ref) => (
  <span
    data-slot="inline-edit-placeholder"
    className={clsx(s.placeholder, className)}
    {...props}
    ref={ref}
  />
));

InlineEditPlaceholder.displayName = 'InlineEdit.Placeholder';
