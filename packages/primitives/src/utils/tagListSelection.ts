import type { Key } from '@koobiq/react-core';
import type { ListState } from '@react-stately/list';

function getForwardKeyRange<T extends object>(
  state: ListState<T>,
  fromKey: Key,
  toKey: Key
) {
  const keys: Key[] = [];
  let key: Key | null = fromKey;

  while (key != null) {
    keys.push(key);

    if (key === toKey) {
      return keys;
    }

    key = state.collection.getKeyAfter(key);
  }

  return null;
}

export function getTagListKeyRange<T extends object>(
  state: ListState<T>,
  fromKey: Key,
  toKey: Key
) {
  if (!state.collection.getItem(fromKey) || !state.collection.getItem(toKey)) {
    return [];
  }

  return (
    getForwardKeyRange(state, fromKey, toKey) ??
    getForwardKeyRange(state, toKey, fromKey) ??
    []
  );
}

export function addTagListRangeSelection<T extends object>(
  state: ListState<T>,
  anchorKey: Key,
  currentKey: Key,
  previousRange?: { anchorKey: Key; currentKey: Key }
) {
  const { selectionManager } = state;

  if (selectionManager.selectionMode !== 'multiple') {
    return null;
  }

  const selectedKeys = new Set(selectionManager.selectedKeys);
  const rangeKeys = getTagListKeyRange(state, anchorKey, currentKey);

  if (!rangeKeys.length) {
    return null;
  }

  if (previousRange) {
    for (const key of getTagListKeyRange(
      state,
      previousRange.anchorKey,
      previousRange.currentKey
    )) {
      selectedKeys.delete(key);
    }
  }

  for (const key of rangeKeys) {
    if (selectionManager.canSelectItem(key)) {
      selectedKeys.add(key);
    }
  }

  selectionManager.setSelectedKeys(selectedKeys);

  return selectedKeys;
}
