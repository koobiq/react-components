import type { Key } from '../../../../index';
import type { ButtonProps } from '../../../Button';
import type { ActionsPanelActionRenderItem } from '../../type';

export type ActionsPanelMoreActionProps = ButtonProps & {
  selectedItemCount?: number | 'all';
  collapsedItems: ActionsPanelActionRenderItem[];
  /** Handler called when any breadcrumb item is pressed. It returns the item key. */
  onAction?: (key: Key) => void;
};
