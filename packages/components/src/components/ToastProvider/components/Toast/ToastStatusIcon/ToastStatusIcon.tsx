import { forwardRef, type ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import type { ToastPropStatus } from '../../../index';

import s from './ToastStatusIcon.module.css';
import { matchStatusToIcon } from './utils';

export type ToastStatusIconProps = {
  status?: ToastPropStatus;
  icon?: ReactNode;
};

export const ToastStatusIcon = forwardRef<HTMLDivElement, ToastStatusIconProps>(
  ({ status = 'info', icon }, ref) => (
    <div className={clsx(s.base, status && s[status])} ref={ref}>
      {icon || matchStatusToIcon[status]}
    </div>
  )
);

ToastStatusIcon.displayName = 'ToastStatusIcon';
