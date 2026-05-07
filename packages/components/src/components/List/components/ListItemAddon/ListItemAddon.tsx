'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './ListItemAddon.module.css';
import type { ListItemAddonProps, ListItemAddonRef } from './types';

export const ListItemAddon = forwardRef<ListItemAddonRef, ListItemAddonProps>(
  ({ className, children, disableMargin = false, ...other }, ref) => (
    <div
      data-slot="list-item-addon"
      className={clsx(s.base, disableMargin && s.disableMargin, className)}
      {...other}
      ref={ref}
    >
      {children}
    </div>
  )
);

ListItemAddon.displayName = 'ListItemAddon';
