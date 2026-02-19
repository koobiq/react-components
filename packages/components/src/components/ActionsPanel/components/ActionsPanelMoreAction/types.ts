import type { Key } from '../../../../index';
import type { ButtonProps } from '../../../Button';
import type { ActionsPanelActionRenderItem } from '../../types';

export type ActionsPanelMoreActionProps = ButtonProps & {
  selectedItemCount?: number | 'all';
  collapsedItems: ActionsPanelActionRenderItem[];
  onAction?: (key: Key) => void;
  selectedExtraCount?: number;
};
