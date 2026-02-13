'use client';

import s from './ActionPanelContainer.module.css';
import type { ActionsPanelContainerProps } from './types';

export const ActionsPanelContainer = (props: ActionsPanelContainerProps) => {
  const { children } = props;

  return <div className={s.base}>{children}</div>;
};
