import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './AlertIcon.module.css';
import type { AlertIconProps } from './types';
import { matchStatusToIcon } from './utils';

export const AlertIcon = forwardRef<HTMLDivElement, AlertIconProps>(
  ({ status = 'info', icon, isCompact }, ref) => (
    <div
      className={clsx(s.base, status && s[status], isCompact && s.compact)}
      ref={ref}
    >
      {icon || matchStatusToIcon[isCompact ? 'compact' : 'normal'][status]}
    </div>
  )
);

AlertIcon.displayName = 'AlertIcon';
