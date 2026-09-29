import type { Collection, Key, Node } from '@koobiq/react-core';

/** A selected item the clear button checks before removing it. */
export type ClearPredicateItem<T> = {
  /** The item's key. */
  key: Key;
  /**
   * The item's object from `items`. `null` for static children and for a key
   * missing from the collection.
   */
  value: T | null;
  /** The item's text value. Empty for a key missing from the collection. */
  textValue: string;
  /** Whether the item is disabled via `disabledKeys` or its own `isDisabled` prop. */
  isDisabled: boolean;
};

/**
 * Decides whether the clear button removes a selected item: return `true` to
 * clear the item, `false` to keep it. It runs during render, so keep it pure.
 */
export type ClearPredicate<T> = (item: ClearPredicateItem<T>) => boolean;

/** The part of a collection state the clear helpers read. */
export type ClearPredicateState<T> = {
  disabledKeys: Set<Key>;
  collection: Collection<Node<T>>;
};

/**
 * Whether the user cannot change the item's selection: its key is in
 * `disabledKeys` or the item has `isDisabled`. Unlike
 * `SelectionManager.isDisabled`, it does not depend on `disabledBehavior`.
 */
export function isSelectionDisabled<T>(
  disabledKeys: Set<Key>,
  key: Key,
  item?: Node<T> | null
): boolean {
  return disabledKeys.has(key) || Boolean(item?.props?.isDisabled);
}

const defaultClearPredicate = <T>(item: ClearPredicateItem<T>) =>
  !item.isDisabled;

/**
 * Returns the keys the clear button removes: the ones `clearPredicate`
 * accepts, by default every key except the disabled ones.
 */
export function getClearKeys<T>(
  keys: Iterable<Key>,
  { disabledKeys, collection }: ClearPredicateState<T>,
  clearPredicate: ClearPredicate<T> = defaultClearPredicate
): Set<Key> {
  const clearKeys = new Set<Key>();

  for (const key of keys) {
    const item = collection.getItem(key);

    const shouldClear = clearPredicate({
      key,
      value: item?.value ?? null,
      textValue: item?.textValue ?? '',
      isDisabled: isSelectionDisabled(disabledKeys, key, item),
    });

    if (shouldClear) clearKeys.add(key);
  }

  return clearKeys;
}
