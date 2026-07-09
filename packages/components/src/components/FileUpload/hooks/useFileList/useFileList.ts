'use client';

import { useCallback } from 'react';

import { useControlledState } from '@koobiq/react-core';

export interface UseFileListParams<T> {
  /** Controlled list value. */
  list?: T[];
  /** Uncontrolled initial list. */
  defaultList?: T[];
  /** Fires with the full list whenever it changes. */
  onListChange?: (next: T[]) => void;
  /** Fires with the chunk of items that were just added. */
  onItemsAdded?: (items: T[]) => void;
  /** Fires with a removed item and its index (only from `removeAt`). */
  onItemRemoved?: (item: T, index: number) => void;
}

export interface UseFileListReturn<T> {
  /** The current list. */
  list: T[];
  /** Appends a single item and emits the added event. */
  add: (item: T) => void;
  /** Appends multiple items and emits the added event. */
  addArray: (items: T[]) => void;
  /**
   * Removes the first occurrence of `item`, returning the survivors. Emits no
   * removal event (parity with the Angular `KbqFileList.remove`).
   */
  remove: (item: T) => T[];
  /**
   * Removes the item at `index`, returning it and emitting the removal event.
   * Always produces a new array reference.
   */
  removeAt: (index: number) => T | undefined;
  /** Immutably merges a patch into the item at `index`. */
  updateAt: (index: number, patch: Partial<T>) => void;
}

/**
 * Headless list-state container for upload items. Controlled or uncontrolled;
 * mirrors the add/remove/removeAt semantics of the Angular `KbqFileList`.
 */
export function useFileList<T>(
  params: UseFileListParams<T> = {}
): UseFileListReturn<T> {
  const {
    list: listProp,
    defaultList,
    onListChange,
    onItemsAdded,
    onItemRemoved,
  } = params;

  const [list, setList] = useControlledState<T[]>(
    listProp,
    defaultList ?? [],
    onListChange
  );

  const add = useCallback(
    (item: T) => {
      setList([...list, item]);
      onItemsAdded?.([item]);
    },
    [list, setList, onItemsAdded]
  );

  const addArray = useCallback(
    (items: T[]) => {
      setList([...list, ...items]);
      onItemsAdded?.(items);
    },
    [list, setList, onItemsAdded]
  );

  const remove = useCallback(
    (item: T): T[] => {
      const index = list.indexOf(item);

      if (index === -1) {
        return list;
      }

      const survivors = list.filter((_, i) => i !== index);

      setList(survivors);

      return survivors;
    },
    [list, setList]
  );

  const removeAt = useCallback(
    (index: number): T | undefined => {
      const copy = [...list];
      const [removed] = copy.splice(index, 1);

      setList(copy);

      if (removed !== undefined) {
        onItemRemoved?.(removed, index);
      }

      return removed;
    },
    [list, setList, onItemRemoved]
  );

  const updateAt = useCallback(
    (index: number, patch: Partial<T>) => {
      setList(
        list.map((item, i) => (i === index ? { ...item, ...patch } : item))
      );
    },
    [list, setList]
  );

  return { list, add, addArray, remove, removeAt, updateAt };
}
