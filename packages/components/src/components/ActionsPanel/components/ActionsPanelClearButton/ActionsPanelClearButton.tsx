import { useLocalizedStringFormatter } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';

import { Button } from '../../../Button';
import { FlexBox } from '../../../FlexBox';
import intlMessages from '../../intl.json';
import { ActionsPanelDivider } from '../ActionsPanelDivider';

export type ActionsPanelClearButtonProps = ExtendableComponentPropsWithRef<
  {
    onClearSelection?: () => void;
  },
  'div'
>;

export const ActionsPanelClearButton = ({
  onClearSelection,
  ...other
}: ActionsPanelClearButtonProps) => {
  const t = useLocalizedStringFormatter(intlMessages);

  return (
    <FlexBox alignItems="center" {...other}>
      <ActionsPanelDivider />
      <Button
        aria-label={t.format('clear selection')}
        onPress={onClearSelection}
        startIcon={<IconCircleXmark16 />}
        onlyIcon
      />
    </FlexBox>
  );
};
