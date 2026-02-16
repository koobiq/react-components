'use client';

import { clsx } from '@koobiq/react-core';
import { IconEllipsisVertical16 } from '@koobiq/react-icons';

import { Button } from '../../../Button';

import s from './ActionsPanelMoreAction.module.css';
import type { ActionsPanelMoreActionProps } from './types';

export const ActionsPanelMoreAction = (props: ActionsPanelMoreActionProps) => {
  const { children, ref, className, ...other } = props;

  return (
    <Button
      ref={ref}
      data-slot="more-action"
      className={clsx(s.base, className)}
      startIcon={<IconEllipsisVertical16 />}
      onlyIcon
      {...other}
    >
      {children}
    </Button>
  );
};
