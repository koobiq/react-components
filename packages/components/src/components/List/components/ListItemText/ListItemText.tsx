'use client';

import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';

import { Typography } from '../../../Typography';

import s from './ListItemText.module.css';
import type { ListItemTextProps, ListItemTextRef } from './types';

export const ListItemText = forwardRef<ListItemTextRef, ListItemTextProps>(
  ({ className, children, caption, slotProps, ...other }, ref) => (
    <span className={clsx(s.base, className)} {...other} ref={ref}>
      <Typography as="span" align="start" ellipsis {...slotProps?.text}>
        {children}
      </Typography>
      {isNotNil(caption) && (
        <Typography
          as="span"
          align="start"
          color="contrast-secondary"
          className={s.caption}
          variant="text-compact"
          {...slotProps?.caption}
        >
          {caption}
        </Typography>
      )}
    </span>
  )
);

ListItemText.displayName = 'ListItemText';
