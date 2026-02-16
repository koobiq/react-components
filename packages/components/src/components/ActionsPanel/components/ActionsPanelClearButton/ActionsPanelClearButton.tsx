import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';

import { Button } from '../../../Button';
import { FlexBox } from '../../../FlexBox';
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
}: ActionsPanelClearButtonProps) => (
  <FlexBox alignItems="center" {...other}>
    <ActionsPanelDivider />
    <Button
      onPress={onClearSelection}
      startIcon={<IconCircleXmark16 />}
      onlyIcon
    />
  </FlexBox>
);
