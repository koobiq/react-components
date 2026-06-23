'use client';

import { useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

import {
  FocusScope,
  mergeProps,
  useFocusRing,
  filterDOMProps,
} from '@koobiq/react-core';
import type { Key, RefObject, Node } from '@koobiq/react-core';
import {
  useTree,
  Provider,
  CollectionRendererContext,
  TreeStateContext,
  BaseCollection,
  useRenderProps,
} from '@koobiq/react-primitives';
import type {
  TreeProps,
  TreeRenderProps,
  TreeState,
  CollectionNode,
  TreeSelectState,
} from '@koobiq/react-primitives';

type MutableCollectionNode<T> = {
  -readonly [K in keyof CollectionNode<T>]: CollectionNode<T>[K];
};

export class TreeCollection<T> extends BaseCollection<T> {
  private expandedKeys: Set<Key> = new Set();

  withExpandedKeys(lastExpandedKeys: Set<Key>, expandedKeys: Set<Key>) {
    const collection = this.clone();

    collection.expandedKeys = expandedKeys;

    TreeCollection.cloneAncestorSections(
      expandedKeys,
      lastExpandedKeys,
      collection
    );

    TreeCollection.cloneAncestorSections(
      lastExpandedKeys,
      expandedKeys,
      collection
    );

    collection.frozen = this.frozen;

    return collection;
  }

  /**
   * Rebuild the collection keeping only `keys`, fixing up sibling/child links.
   * Used for search: the visible set is matches plus their ancestors.
   */
  filterByKeys(keys: Set<Key>): TreeCollection<T> {
    const filtered = new TreeCollection<T>();

    const copyLevel = (
      siblings: Iterable<Node<T>>,
      parentKey: Key | null
    ): [Key | null, Key | null] => {
      let firstKey: Key | null = null;
      let prev: MutableCollectionNode<T> | null = null;
      let index = 0;

      for (const node of siblings) {
        // Only items are filtered by the visible set; structural children
        // (e.g. the row content) ride along so kept rows keep their label.
        if (node.type === 'item' && !keys.has(node.key)) continue;

        const clone = (
          node as CollectionNode<T>
        ).clone() as MutableCollectionNode<T>;

        clone.parentKey = parentKey;
        clone.prevKey = prev?.key ?? null;
        clone.nextKey = null;
        clone.index = index;

        index += 1;

        const [firstChildKey, lastChildKey] = copyLevel(
          this.getChildren(node.key),
          clone.key
        );

        clone.firstChildKey = firstChildKey;
        clone.lastChildKey = lastChildKey;

        filtered.addNode(clone as CollectionNode<T>);

        if (prev) prev.nextKey = clone.key;
        if (firstKey == null) firstKey = clone.key;

        prev = clone;
      }

      return [firstKey, prev?.key ?? null];
    };

    const roots: Node<T>[] = [];
    let key = this.firstKey;

    while (key != null) {
      const node = this.getItem(key);

      if (!node) break;

      roots.push(node);
      key = node.nextKey ?? null;
    }

    const [firstKey, lastKey] = copyLevel(roots, null);

    filtered.commit(firstKey, lastKey);

    return filtered;
  }

  private static cloneAncestorSections<T>(
    keys: Iterable<Key>,
    excludeSet: Set<Key>,
    collection: TreeCollection<T>
  ) {
    for (const key of keys) {
      if (excludeSet.has(key)) continue;

      let currentKey: Key | null = key;

      while (currentKey != null) {
        const item = collection.getItem(currentKey) as CollectionNode<T>;

        if (item?.type === 'section') {
          collection.keyMap.set(currentKey, item.clone());
          break;
        }

        currentKey = item?.parentKey ?? null;
      }
    }
  }

  *[Symbol.iterator]() {
    const firstKey = this.getFirstKey();

    let node: Node<T> | null = firstKey != null ? this.getItem(firstKey) : null;

    while (node) {
      yield node as Node<T>;

      if (node.type === 'section') {
        node = node.nextKey ? this.getItem(node.nextKey) : null;
      } else {
        const key = this.getKeyAfter(node.key);

        node = key ? this.getItem(key) : null;
      }
    }
  }

  getLastKey() {
    const key = this.lastKey;

    if (key == null) return null;

    let node = this.getItem(key) as CollectionNode<T>;

    while (
      node?.lastChildKey != null &&
      (node.type !== 'item' || this.expandedKeys.has(node.key))
    ) {
      node = this.getItem(node.lastChildKey) as CollectionNode<T>;
    }

    return node?.key;
  }

  getKeyAfter(key: Key) {
    let node = this.getItem(key) as CollectionNode<T>;

    if (!node) return null;

    if (
      (this.expandedKeys.has(node.key) || node.type !== 'item') &&
      node.firstChildKey != null
    ) {
      return node.firstChildKey;
    }

    while (node) {
      if (node.nextKey != null) return node.nextKey;

      if (node.parentKey != null) {
        node = this.getItem(node.parentKey) as CollectionNode<T>;
      } else {
        return null;
      }
    }

    return null;
  }

  getKeyBefore(key: Key) {
    let node = this.getItem(key) as CollectionNode<T>;

    if (!node) return null;

    if (node.prevKey != null) {
      node = this.getItem(node.prevKey) as CollectionNode<T>;

      while (
        node &&
        (node.type !== 'item' || this.expandedKeys.has(node.key)) &&
        node.lastChildKey != null
      ) {
        node = this.getItem(node.lastChildKey) as CollectionNode<T>;
      }

      return node?.key ?? null;
    }

    return node.parentKey;
  }

  getChildren(key: Key): Iterable<Node<T>> {
    return this.iterateChildren(key);
  }

  private *iterateChildren(key: Key): IterableIterator<Node<T>> {
    const parent = this.getItem(key) as CollectionNode<T> | null;

    let node =
      parent?.firstChildKey != null
        ? (this.getItem(parent.firstChildKey) as CollectionNode<T>)
        : null;

    if (parent && parent.type === 'section' && node) {
      while (node && node.key !== parent.nextKey) {
        yield this.getItem(node.key)!;

        const nextKey = this.getKeyAfter(node.key);

        node =
          nextKey != null
            ? (this.getItem(nextKey)! as CollectionNode<T>)
            : null;
      }
    } else {
      while (node) {
        yield node as Node<T>;

        node =
          node.nextKey != null
            ? (this.getItem(node.nextKey)! as CollectionNode<T>)
            : null;
      }
    }
  }

  getTextValue(key: Key): string {
    const item = this.getItem(key);

    return item ? item.textValue : '';
  }
}

type TreeInnerProps<T extends object> = {
  props: TreeProps<T>;
  state: TreeState<T>;
  treeRef: RefObject<HTMLDivElement | null>;
};

export function TreeInner<T extends object>({
  props,
  state,
  treeRef: ref,
}: TreeInnerProps<T>) {
  const { CollectionRoot, isVirtualized, layoutDelegate } = useContext(
    CollectionRendererContext
  );

  const { gridProps } = useTree(
    {
      ...props,
      isVirtualized,
      layoutDelegate,
    },
    state,
    ref
  );

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const renderValues: TreeRenderProps = {
    isEmpty: state.collection.size === 0,
    isFocused,
    isFocusVisible,
    selectionMode: state.selectionManager.selectionMode,
    allowsDragging: false,
    state,
  };

  const renderProps = useRenderProps({
    ...props,
    children: undefined,
    defaultClassName: 'react-aria-Tree',
    values: renderValues,
  });

  let emptyState: ReactNode = null;

  if (state.collection.size === 0 && props.renderEmptyState) {
    const content = props.renderEmptyState({
      isFocused,
      isFocusVisible,
      selectionMode: state.selectionManager.selectionMode,
      allowsDragging: false,
      state,
    });

    emptyState = (
      <div role="row" style={{ display: 'contents' }} aria-level={1}>
        <div role="gridcell" style={{ display: 'contents' }}>
          {content}
        </div>
      </div>
    );
  }

  const DOMProps = filterDOMProps(props, { global: true });

  return (
    <FocusScope>
      <div
        {...mergeProps(DOMProps, renderProps, gridProps, focusProps)}
        ref={ref}
        slot={props.slot || undefined}
        data-empty={state.collection.size === 0 || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-selection-mode={
          state.selectionManager.selectionMode === 'none'
            ? undefined
            : state.selectionManager.selectionMode
        }
      >
        <Provider values={[[TreeStateContext, state]]}>
          <CollectionRoot collection={state.collection} scrollRef={ref} />
        </Provider>
        {emptyState}
      </div>
    </FocusScope>
  );
}

/**
 * Collect the keys to show for a search query: every node whose `textValue`
 * matches, plus all of its ancestors (so the path stays visible). The
 * ancestors are also returned as the keys to auto-expand.
 */
export function getFilteredKeys<T extends object>(
  collection: BaseCollection<T>,
  match: (textValue: string) => boolean
): { visibleKeys: Set<Key>; autoExpandedKeys: Set<Key> } {
  const visibleKeys = new Set<Key>();
  const autoExpandedKeys = new Set<Key>();

  for (const key of collection.getKeys()) {
    const node = collection.getItem(key);

    if (node?.type !== 'item' || !match(node.textValue)) continue;

    visibleKeys.add(key);

    let parentKey = node.parentKey ?? null;

    while (parentKey != null) {
      visibleKeys.add(parentKey);

      if (autoExpandedKeys.has(parentKey)) break;

      autoExpandedKeys.add(parentKey);
      parentKey = collection.getItem(parentKey)?.parentKey ?? null;
    }
  }

  return { visibleKeys, autoExpandedKeys };
}

/**
 * A view of the tree state for rendering the popup: when `collection` is set
 * (a filtered collection), the tree renders it with `expandedKeys`, while the
 * selection state stays bound to the full collection — mirroring
 * `UNSTABLE_useFilteredListState`.
 */
export function useFilteredTreeState<T extends object>(
  state: TreeSelectState<T>,
  collection: TreeCollection<T> | null,
  expandedKeys: Set<Key> | null
): TreeState<T> {
  const selectionManager = collection
    ? state.selectionManager.withCollection(collection)
    : state.selectionManager;

  useEffect(() => {
    const { focusedKey } = selectionManager;

    if (collection && focusedKey != null && !collection.getItem(focusedKey)) {
      selectionManager.setFocusedKey(collection.getFirstKey());
    }
  }, [collection, selectionManager]);

  if (!collection) return state;

  return {
    ...state,
    collection,
    selectionManager,
    expandedKeys: expandedKeys ?? state.expandedKeys,
  };
}
