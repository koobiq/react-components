import { clsx, type ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import { FlexBox } from '../../../FlexBox';
import { Typography } from '../../../Typography';
import { ActionsPanelDivider } from '../ActionsPanelDivider';

import s from './ActionsPanelCounter.module.css';

export type ActionsPanelCounterProps = ExtendableComponentPropsWithRef<
  {
    selectedItemCount?: number | 'all';
  },
  'div'
>;

export const ActionsPanelCounter = ({
  selectedItemCount,
  className,
  ...other
}: ActionsPanelCounterProps) => (
  <FlexBox alignItems="center" className={clsx(s.base, className)} {...other}>
    <Typography
      className={s.text}
      color="on-contrast"
      variant="text-normal-medium"
    >
      Selected:&nbsp;<span className={s.counterValue}>{selectedItemCount}</span>
    </Typography>
    <ActionsPanelDivider className={s.divider} />
  </FlexBox>
);
