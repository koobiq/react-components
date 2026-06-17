'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { useControlledState } from '@koobiq/react-core';
import type { Key, Selection, Validation } from '@koobiq/react-core';
import type { FormValidationState } from '@react-stately/form';
import { useFormValidationState } from '@react-stately/form';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import type { OverlayTriggerProps } from '@react-types/overlays';

export type TreeSelectNode = {
  /** Unique identifier of the node. */
  id: string;
  /** Content rendered for the node. */
  label: ReactNode;
  /**
   * Text used for searching/filtering.
   * Falls back to `label` when `label` is a string.
   */
  textValue?: string;
  /** If `true`, the node can't be selected. */
  isDisabled?: boolean;
  /** Child nodes. */
  children?: TreeSelectNode[];
};

export interface TreeSelectProps
  extends Validation<string | null>, OverlayTriggerProps {
  /** Root nodes of the tree. */
  items: TreeSelectNode[];
  /** If `true`, the whole control is disabled. */
  isDisabled?: boolean;
  /** The id of the selected node (controlled). */
  selectedKey?: string | null;
  /** The id of the initially selected node (uncontrolled). */
  defaultSelectedKey?: string | null;
  /** Handler called when the selection changes. */
  onSelectionChange?: (key: string | null) => void;
  /** The ids of expanded nodes (controlled). */
  expandedKeys?: Selection;
  /** Ids of the nodes expanded by default (uncontrolled). */
  defaultExpandedKeys?: Iterable<string>;
  /** Handler called when expanded keys change. */
  onExpandedChange?: (keys: Selection) => void;
}

export interface TreeSelectState
  extends OverlayTriggerState, FormValidationState {
  /** Whether the trigger is focused. */
  isFocused: boolean;
  /** Sets whether the trigger is focused. */
  setFocused(isFocused: boolean): void;
  /** The selected node id. */
  selectedKey: string | null;
  /** The selected node as an object from the source tree. */
  selectedNode: TreeSelectNode | null;
  /** The selected key as a Tree-compatible selectedKeys collection. */
  selectedKeys: Set<Key>;
  /** Set the selected node id. */
  setSelectedKey(key: string | null): void;
  /** Expanded tree node ids. */
  expandedKeys: Selection;
  /** Set expanded tree node ids. */
  setExpandedKeys(keys: Selection): void;
  /** Disabled tree node ids. */
  disabledKeys: Set<string>;
}

function collectNodeIds(
  nodes: TreeSelectNode[],
  predicate: (node: TreeSelectNode) => boolean
): string[] {
  return nodes.flatMap((node) => [
    ...(predicate(node) ? [node.id] : []),
    ...(node.children ? collectNodeIds(node.children, predicate) : []),
  ]);
}

function findNodeById(
  nodes: TreeSelectNode[],
  id: string | null
): TreeSelectNode | null {
  if (id == null) return null;

  for (const node of nodes) {
    if (node.id === id) return node;

    if (node.children) {
      const child = findNodeById(node.children, id);

      if (child) return child;
    }
  }

  return null;
}

export function useTreeSelectState({
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
}: TreeSelectProps): TreeSelectState {
  const overlayState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const [isFocused, setFocused] = useState(false);

  const [selectedKey, setSelectedKeyState] = useControlledState<
    string | null,
    string | null
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
          : collectNodeIds(items, (node) => node.isDisabled === true)
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
    value: selectedKey,
  });

  const setSelectedKey = (key: string | null) => {
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
