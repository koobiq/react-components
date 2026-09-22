'use client';

import { forwardRef, useContext, useLayoutEffect, useState } from 'react';

import { clsx, isNotNil, useObjectRef } from '@koobiq/react-core';

import { Tooltip } from '../../../Tooltip';
import { Typography } from '../../../Typography';

import { ListItemContext } from './ListItemContext';
import s from './ListItemText.module.css';
import type { ListItemTextProps, ListItemTextRef } from './types';

/** Returns the lines that don't fit, one per row. */
const getOverflowText = (root: HTMLElement | null) =>
  [...(root?.children ?? [])]
    .filter((line) => line.scrollWidth > line.clientWidth)
    .map((line) => line.textContent)
    .join('\n');

export const ListItemText = forwardRef<ListItemTextRef, ListItemTextProps>(
  (
    {
      className,
      children,
      caption,
      autoWidth,
      showOverflowTooltip = false,
      slotProps,
      ...other
    },
    ref
  ) => {
    const rootRef = useObjectRef(ref);
    const item = useContext(ListItemContext);

    const [overflowText, setOverflowText] = useState('');

    // Measured after every render of a hovered item, so the text and the width are current.
    useLayoutEffect(() => {
      setOverflowText(
        showOverflowTooltip && item.isHovered
          ? getOverflowText(rootRef.current)
          : ''
      );
    });

    return (
      <span
        className={clsx(s.base, autoWidth && s.autoWidth, className)}
        {...other}
        ref={rootRef}
      >
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
        {overflowText && (
          <Tooltip
            isOpen
            anchorRef={item.ref}
            // A submenu opens to the side, so the tooltip goes above the item.
            placement={item.hasSubmenu ? 'top' : 'end'}
            style={{ pointerEvents: 'none', whiteSpace: 'pre-line' }}
          >
            {overflowText}
          </Tooltip>
        )}
      </span>
    );
  }
);

ListItemText.displayName = 'ListItemText';
