import type { ButtonProps } from '../../../Button';
import type { ActionsPanelActionRenderItem } from '../../type';

export type ActionsPanelMoreActionProps = ButtonProps & {
  selectedItemCount?: number | 'all';
  collapsedItems: ActionsPanelActionRenderItem[];
};
