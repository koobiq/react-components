'use client';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';
import { IconEllipsisVertical16 } from '@koobiq/react-icons';

import { Button } from '../../../Button';
import intlMessages from '../../intl.json';

import s from './ActionsPanelMoreAction.module.css';
import type { ActionsPanelMoreActionProps } from './types';

export const ActionsPanelMoreAction = (props: ActionsPanelMoreActionProps) => {
  const { children, ref, className, ...other } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  return (
    <Button
      ref={ref}
      data-slot="more-action"
      aria-label={t.format('show more actions')}
      className={clsx(s.base, className)}
      startIcon={<IconEllipsisVertical16 />}
      onlyIcon
      {...other}
    >
      {children}
    </Button>
  );
};
