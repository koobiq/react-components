import { useMemo } from 'react';

import type { Key, Node } from '@koobiq/react-core';

import { getClearKeys } from './clearPredicate';
import type { ClearPredicate, ClearPredicateState } from './clearPredicate';

/** The part of a selection state `useSelectionClear` reads and updates. */
export type SelectionClearState<T> = ClearPredicateState<T> & {
  /** The selected items found in the collection, i.e. the displayed ones. */
  selectedItems: Node<T>[];
  selectionManager: {
    selectedKeys: Set<Key>;
    setSelectedKeys: (keys: Iterable<Key>) => void;
  };
};

/** Props of `useSelectionClear`. */
export type SelectionClearProps<T> = {
  /** Whether the field can be emptied. */
  isClearable?: boolean;
  /** Whether the selection can be focused but not changed by the user. */
  isReadOnly?: boolean;
  /** Decides which selected items the clear button removes. */
  clearPredicate?: ClearPredicate<T>;
  /** Handler that is called after the clear button removes the items. */
  onClear?: () => void;
};

/** The clear-button state and action returned by `useSelectionClear`. */
export type SelectionClearAria = {
  /** Whether the clear button would remove one of the displayed items. */
  canClear: boolean;
  /** Removes the selected items accepted by `clearPredicate`. */
  clear: () => void;
};

/**
 * Clear-button behavior for a selection: removes the selected items
 * `clearPredicate` accepts, by default every item except the disabled ones.
 */
export function useSelectionClear<T>(
  state: SelectionClearState<T>,
  props: SelectionClearProps<T>
): SelectionClearAria {
  const { isClearable, isReadOnly, clearPredicate, onClear } = props;
  const { collection, disabledKeys, selectedItems, selectionManager } = state;
  const { selectedKeys } = selectionManager;

  const clearKeys = useMemo(
    () =>
      isClearable
        ? getClearKeys(
            selectedKeys,
            { collection, disabledKeys },
            clearPredicate
          )
        : new Set<Key>(),
    [isClearable, selectedKeys, collection, disabledKeys, clearPredicate]
  );

  const canClear = selectedItems.some((item) => clearKeys.has(item.key));

  const clear = () => {
    if (isReadOnly || !clearKeys.size) return;

    selectionManager.setSelectedKeys(
      [...selectedKeys].filter((key) => !clearKeys.has(key))
    );

    onClear?.();
  };

  return { canClear, clear };
}
