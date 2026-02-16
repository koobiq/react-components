import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';

import { FlexBox } from '../../../FlexBox';
import { ActionsPanelAction } from '../ActionsPanelAction';
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
    <ActionsPanelAction
      onPress={onClearSelection}
      startIcon={<IconCircleXmark16 />}
      onlyIcon
    />
  </FlexBox>
);
