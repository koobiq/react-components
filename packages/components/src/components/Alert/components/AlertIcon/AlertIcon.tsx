import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { IconItem } from '../../../IconItem';

import s from './AlertIcon.module.css';
import type { AlertIconProps } from './types';
import { matchStatusToIcon, matchStatusToIconItemColor } from './utils';

export const AlertIcon = forwardRef<HTMLDivElement, AlertIconProps>(
  ({ status = 'info', icon, isCompact, className, ...other }, ref) => (
    <IconItem
      {...other}
      color={matchStatusToIconItemColor[status]}
      variant={isCompact ? 'fade' : 'solid'}
      className={clsx(s.base, isCompact && s.compact, className)}
      ref={ref}
    >
      {icon || matchStatusToIcon[isCompact ? 'compact' : 'normal'][status]}
    </IconItem>
  )
);

AlertIcon.displayName = 'AlertIcon';
