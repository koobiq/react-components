'use client';

import { Button } from '../../../Button';

import type { ActionsPanelActionProps } from './types';

export const ActionsPanelAction = (props: ActionsPanelActionProps) => {
  const { children, ...other } = props;

  return (
    <Button data-slot="action" {...other}>
      {children}
    </Button>
  );
};
