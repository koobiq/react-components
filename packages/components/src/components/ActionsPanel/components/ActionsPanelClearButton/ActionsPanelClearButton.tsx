import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { useLocalizedStringFormatter, clsx } from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';

import { Button } from '../../../Button';
import intlMessages from '../../intl.json';
import { ActionsPanelDivider } from '../ActionsPanelDivider';

import s from './ActionsPanelClearButton.module.css';

export type ActionsPanelClearButtonProps = ExtendableComponentPropsWithRef<
  {
    onClearSelection?: () => void;
  },
  'div'
>;

export const ActionsPanelClearButton = ({
  onClearSelection,
  className,
  ...other
}: ActionsPanelClearButtonProps) => {
  const t = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={clsx(s.base, className)} {...other}>
      <ActionsPanelDivider />
      <Button
        className={s.clearButton}
        aria-label={t.format('clear selection')}
        onPress={onClearSelection}
        startIcon={<IconCircleXmark16 />}
        onlyIcon
      />
    </div>
  );
};
