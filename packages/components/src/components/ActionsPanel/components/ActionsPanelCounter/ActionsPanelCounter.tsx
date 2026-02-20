import {
  type DataAttributeProps,
  type ExtendableComponentPropsWithRef,
  isNumber,
} from '@koobiq/react-core';
import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';

import { Badge } from '../../../Badge';
import { FlexBox } from '../../../FlexBox';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl.json';
import { ActionsPanelDivider } from '../ActionsPanelDivider';

import s from './ActionsPanelCounter.module.css';

export type ActionsPanelCounterProps = ExtendableComponentPropsWithRef<
  {
    selectedItemCount?: number | 'all';
    selectedExtraCount?: number;
  } & DataAttributeProps,
  'div'
>;

export const ActionsPanelCounter = ({
  selectedItemCount,
  selectedExtraCount,
  className,
  ...other
}: ActionsPanelCounterProps) => {
  const t = useLocalizedStringFormatter(intlMessages);

  const isAll = selectedItemCount === 'all';

  return (
    <FlexBox alignItems="center" className={clsx(s.base, className)} {...other}>
      <Typography
        as="div"
        className={s.text}
        ellipsis
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
        {isNumber(selectedExtraCount) && (
          <Badge variant="outline-fade-contrast" className={s.extraCounter}>
            +{selectedExtraCount}
          </Badge>
        )}
      </Typography>
      <ActionsPanelDivider />
    </FlexBox>
  );
};
