'use client';

import { useMemo, useState } from 'react';

import { useControlledState } from '@koobiq/react-core';
import type { Key, Selection, Validation } from '@koobiq/react-core';
import type { FormValidationState } from '@react-stately/form';
import { useFormValidationState } from '@react-stately/form';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import type { OverlayTriggerProps } from '@react-types/overlays';

type TreeSelectItemData = {
  children?: Iterable<unknown>;
  id?: Key;
  isDisabled?: boolean;
};

export interface TreeSelectProps<T extends object = object>
  extends Validation<string | null>, OverlayTriggerProps {
  /** Root nodes of the tree. */
  items?: Iterable<T>;
  /** If `true`, the whole control is disabled. */
  isDisabled?: boolean;
  /** The id of the selected node (controlled). */
  selectedKey?: Key | null;
  /** The id of the initially selected node (uncontrolled). */
  defaultSelectedKey?: Key | null;
  /** Handler called when the selection changes. */
  onSelectionChange?: (key: Key | null) => void;
  /** The ids of expanded nodes (controlled). */
  expandedKeys?: Selection;
  /** Ids of the nodes expanded by default (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>;
  /** Handler called when expanded keys change. */
  onExpandedChange?: (keys: Selection) => void;
}

export interface TreeSelectState<T extends object = object>
  extends OverlayTriggerState, FormValidationState {
  /** Whether the trigger is focused. */
  isFocused: boolean;
  /** Sets whether the trigger is focused. */
  setFocused(isFocused: boolean): void;
  /** The selected node id. */
  selectedKey: Key | null;
  /** The selected node as an object from the source tree. */
  selectedNode: T | null;
  /** The selected key as a Tree-compatible selectedKeys collection. */
  selectedKeys: Set<Key>;
  /** Set the selected node id. */
  setSelectedKey(key: Key | null): void;
  /** Expanded tree node ids. */
  expandedKeys: Selection;
  /** Set expanded tree node ids. */
  setExpandedKeys(keys: Selection): void;
  /** Disabled tree node ids. */
  disabledKeys: Set<Key>;
}

function getItemChildren<T extends object>(item: T): T[] {
  const children = (item as TreeSelectItemData).children;

  return children ? Array.from(children as Iterable<T>) : [];
}

function getItemId<T extends object>(item: T): Key | null {
  return (item as TreeSelectItemData).id ?? null;
}

function collectNodeIds<T extends object>(
  nodes: Iterable<T> | undefined,
  predicate: (node: T) => boolean
): Key[] {
  if (!nodes) return [];

  return Array.from(nodes).flatMap((node) => {
    const id = getItemId(node);

    return [
      ...(id != null && predicate(node) ? [id] : []),
      ...collectNodeIds(getItemChildren(node), predicate),
    ];
  });
}

function findNodeById<T extends object>(
  nodes: Iterable<T> | undefined,
  id: Key | null
): T | null {
  if (id == null) return null;
  if (!nodes) return null;

  for (const node of nodes) {
    if (getItemId(node) === id) return node;

    const child = findNodeById(getItemChildren(node), id);

    if (child) return child;
  }

  return null;
}

export function useTreeSelectState<T extends object>({
  items,
  isDisabled,
  selectedKey: selectedKeyProp,
  defaultSelectedKey = null,
  onSelectionChange,
  expandedKeys: expandedKeysProp,
  defaultExpandedKeys = [],
  onExpandedChange,
  validate,
  validationBehavior,
  isOpen,
  defaultOpen,
  onOpenChange,
  ...validationProps
}: TreeSelectProps<T>): TreeSelectState<T> {
  const overlayState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const [isFocused, setFocused] = useState(false);

  const [selectedKey, setSelectedKeyState] = useControlledState<
    Key | null,
    Key | null
  >(selectedKeyProp, defaultSelectedKey, onSelectionChange);

  const [defaultExpandedKeySet] = useState(
    () => new Set(defaultExpandedKeys) as Selection
  );

  const [expandedKeys, setExpandedKeys] = useControlledState<
    Selection,
    Selection
  >(expandedKeysProp, defaultExpandedKeySet, onExpandedChange);

  const disabledKeys = useMemo(
    () =>
      new Set(
        isDisabled
          ? collectNodeIds(items, () => true)
          : collectNodeIds(
              items,
              (node) => (node as TreeSelectItemData).isDisabled === true
            )
      ),
    [items, isDisabled]
  );

  const selectedNode = useMemo(
    () => findNodeById(items, selectedKey),
    [items, selectedKey]
  );

  const selectedKeys = useMemo(
    () => (selectedKey != null ? new Set([selectedKey]) : new Set<Key>()),
    [selectedKey]
  );

  const validationState = useFormValidationState<string | null>({
    ...validationProps,
    validate,
    validationBehavior,
    value: selectedKey != null ? String(selectedKey) : null,
  });

  const setSelectedKey = (key: Key | null) => {
    setSelectedKeyState(key);
    validationState.commitValidation();
  };

  return {
    ...validationState,
    ...overlayState,
    isFocused,
    setFocused,
    selectedKey,
    selectedNode,
    selectedKeys,
    setSelectedKey,
    expandedKeys,
    setExpandedKeys,
    disabledKeys,
  };
}
