'use client';

import { clsx } from '@koobiq/react-core';

import s from './ActionPanelContainer.module.css';
import type { ActionsPanelContainerProps } from './types';

export const ActionsPanelContainer = (props: ActionsPanelContainerProps) => {
  const { children, className, ...other } = props;

  return (
    <div className={clsx(s.base, className)} {...other}>
      {children}
    </div>
  );
};
