'use client';

import { clsx } from '@koobiq/react-core';

import { Button } from '../../../Button';

import s from './ActionsPanelAction.module.css';
import type { ActionsPanelActionProps } from './types';

export const ActionsPanelAction = (props: ActionsPanelActionProps) => {
  const { children, ref, className, icon, ...other } = props;

  return (
    <Button
      ref={ref}
      data-slot="action"
      startIcon={icon}
      className={clsx(s.base, className)}
      {...other}
    >
      {children}
    </Button>
  );
};
