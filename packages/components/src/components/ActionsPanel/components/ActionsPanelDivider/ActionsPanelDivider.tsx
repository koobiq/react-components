import { clsx } from '@koobiq/react-core';

import type { DividerProps } from '../../../Divider';
import { Divider } from '../../../Divider';

import s from './ActionsPanelDivider.module.css';

export type ActionsPanelCounterProps = DividerProps;

export const ActionsPanelDivider = ({
  className,
  ...other
}: ActionsPanelCounterProps) => (
  <Divider
    orientation="vertical"
    className={clsx(s.base, className)}
    {...other}
  />
);
