import type { Node } from '@koobiq/react-core';
import { isSelectionDisabled } from '@koobiq/react-primitives';

import type { TagProps } from '../Tag';

import s from './SelectedTags.module.css';
import type { SelectedTagsProps, SelectedTagsSelectionState } from './types';

export const getHiddenCount = (map: boolean[]) =>
  map.filter((item) => !item).length;

/**
 * Props shared by a selected tag in every overflow mode. The tag of a disabled
 * item is disabled and cannot be removed.
 */
export function getSelectedTagProps<T extends object>(
  item: Node<T>,
  state: SelectedTagsSelectionState<T>,
  { isDisabled, isInvalid, isReadOnly }: SelectedTagsProps<T>['states']
): TagProps {
  const isItemDisabled = isSelectionDisabled(
    state.disabledKeys,
    item.key,
    item
  );

  const onRemove = () => {
    if (isItemDisabled) return;

    if (state.selectionManager.isSelected(item.key)) {
      state.selectionManager.toggleSelection(item.key);
    }
  };

  return {
    className: s.tag,
    variant: isInvalid ? 'error-fade' : 'contrast-fade',
    allowsRemoving: true,
    isDisabled: isDisabled || isItemDisabled,
    slotProps: {
      removeIcon: {
        as: 'div',
        tabIndex: undefined,
        onPress: onRemove,
        isDisabled: isReadOnly || isDisabled || isItemDisabled,
      },
    },
  };
}
