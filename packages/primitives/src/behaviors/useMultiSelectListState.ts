import { useMemo } from 'react';
import type { Key } from 'react';

import type {
  Node,
  CollectionBase,
  MultipleSelection,
} from '@koobiq/react-core';
import type { ListState } from '@react-stately/list';
import { useListState } from '@react-stately/list';

export interface MultiSelectListProps<T>
  extends CollectionBase<T>,
    MultipleSelection {}

export interface MultiSelectListState<T> extends ListState<T> {
  /** The keys for the currently selected items. */
  selectedKeys: Set<Key>;
  /** Sets the selected keys. */
  setSelectedKeys(keys: Iterable<Key>): void;
  /** The value of the currently selected items. */
  selectedItems: Node<T>[] | null;
  /** The type of selection. */
  selectionMode: MultipleSelection['selectionMode'];
}

export function useMultiSelectListState<T extends object>(
  props: MultiSelectListProps<T>
): MultiSelectListState<T> {
  const {
    collection,
    disabledKeys,
    selectionManager,
    selectionManager: { setSelectedKeys, selectedKeys, selectionMode },
  } = useListState({
    disallowEmptySelection: props.selectionMode !== 'multiple',
    ...props,
  });

  const missingKeys: Key[] = useMemo(() => {
    if (selectedKeys.size !== 0) {
      return Array.from(selectedKeys)
        .filter(Boolean)
        .filter((key) => !collection.getItem(key));
    }

    return [];
  }, [selectedKeys, collection]);

  const selectedItems = (
    selectedKeys.size !== 0
      ? Array.from(selectedKeys)
          .map((key) => collection.getItem(key))
          // Remove undefined values when some keys are not present in the collection
          .filter(Boolean)
      : null
  ) as Node<T>[] | null;

  if (missingKeys.length) {
    console.warn(
      `Select: Keys "${missingKeys.join(
        ', '
      )}" passed to "selectedKeys" are not present in the collection.`
    );
  }

  return {
    collection,
    disabledKeys,
    selectionManager,
    selectionMode,
    selectedKeys,
    setSelectedKeys: setSelectedKeys.bind(selectionManager),
    selectedItems,
  };
}
