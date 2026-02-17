import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';

import { FlexBox } from '../../../FlexBox';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl.json';
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
}: ActionsPanelCounterProps) => {
  const t = useLocalizedStringFormatter(intlMessages);

  const isAll = selectedItemCount === 'all';

  return (
    <FlexBox alignItems="center" className={clsx(s.base, className)} {...other}>
      <Typography
        className={s.text}
        color="on-contrast"
        variant="text-normal-medium"
      >
        {isAll ? (
          t.format('all selected')
        ) : (
          <>
            {t.format('selected')}&nbsp;
            <span className={s.counterValue}>{selectedItemCount}</span>
          </>
        )}
      </Typography>
      <ActionsPanelDivider className={clsx(!isAll && s.divider)} />
    </FlexBox>
  );
};
