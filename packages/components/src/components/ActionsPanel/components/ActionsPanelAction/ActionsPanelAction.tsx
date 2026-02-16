'use client';

import { clsx } from '@koobiq/react-core';

import { Button } from '../../../Button';

import s from './ActionsPanelAction.module.css';
import type { ActionsPanelActionProps } from './types';

export const ActionsPanelAction = (props: ActionsPanelActionProps) => {
  const { children, ref, className, ...other } = props;

  return (
    <Button
      data-slot="action"
      className={clsx(s.base, className)}
      ref={ref}
      {...other}
    >
      {children}
    </Button>
  );
};
