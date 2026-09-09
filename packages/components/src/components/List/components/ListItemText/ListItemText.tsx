'use client';

import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';

import s from './ListItemText.module.css';
import { ListItemTextLine } from './ListItemTextLine';
import type { ListItemTextProps, ListItemTextRef } from './types';

export const ListItemText = forwardRef<ListItemTextRef, ListItemTextProps>(
  (
    {
      className,
      children,
      caption,
      autoWidth,
      hideTooltip = false,
      slotProps,
      ...other
    },
    ref
  ) => (
    <span
      className={clsx(s.base, autoWidth && s.autoWidth, className)}
      {...other}
      ref={ref}
    >
      <ListItemTextLine
        align="start"
        ellipsis
        {...slotProps?.text}
        hideTooltip={hideTooltip}
      >
        {children}
      </ListItemTextLine>
      {isNotNil(caption) && (
        <ListItemTextLine
          align="start"
          color="contrast-secondary"
          className={s.caption}
          variant="text-compact"
          {...slotProps?.caption}
          hideTooltip={hideTooltip}
        >
          {caption}
        </ListItemTextLine>
      )}
    </span>
  )
);

ListItemText.displayName = 'ListItemText';
