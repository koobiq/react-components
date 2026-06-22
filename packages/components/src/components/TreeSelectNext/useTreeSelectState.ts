import { useMemo, useState } from 'react';

import type {
  Key,
  Validation,
  LabelableProps,
  HelpTextProps,
  InputBase,
  TextInputBase,
  FocusableProps,
  Node,
} from '@koobiq/react-core';
import { useTreeState, useFormValidationState } from '@koobiq/react-primitives';
import type { FormValidationState } from '@koobiq/react-primitives';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import type { TreeState, TreeProps } from '@react-stately/tree';

export interface TreeSelectStateOptions<T extends object>
  extends
    TreeProps<T>,
    LabelableProps,
    InputBase,
    TextInputBase,
    HelpTextProps,
    FocusableProps,
    Validation<string | null> {
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (key: Iterable<Key>) => void;
  /** Sets the open state of the menu. */
  isOpen?: boolean;
  /** Sets the default open state of the menu. */
  defaultOpen?: boolean;
  /** Method that is called when the open state of the menu changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

export type TreeSelectState<T> = {
  /** The value of the selected items. */
  readonly selectedItems: Node<T>[];
  /** Set the selected node id. */
  setSelectedKeys(keys: Iterable<Key>): void;
  /** Whether the select is currently focused. */
  readonly isFocused: boolean;
  /** Sets whether the select is focused. */
  setFocused(isFocused: boolean): void;
} & TreeState<T> &
  OverlayTriggerState &
  FormValidationState;

export function useTreeSelectState<T extends object>(
  props: TreeSelectStateOptions<T>
): TreeSelectState<T> {
  const { selectionMode = 'single' } = props;

  const [isFocused, setFocused] = useState(false);

  const displayValue = props.selectedKeys
    ? Array.from(props.selectedKeys)[0]
    : undefined;

  // validation state
  const validationState = useFormValidationState({
    ...props,
    value:
      Array.isArray(displayValue) && displayValue.length === 0
        ? null
        : (displayValue as any),
  });

  // overlay state
  const overlayState = useOverlayTriggerState({
    isOpen: props.isOpen,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  });

  // tree state
  const treeState = useTreeState({ ...props, selectionMode });

  const selectedItems = useMemo(() => {
    return [...treeState.selectionManager.selectedKeys]
      .map((key) => treeState.collection.getItem(key))
      .filter((item) => item != null);
  }, [treeState.selectionManager.selectedKeys, treeState.collection]);

  const setSelectedKeys = (keys: Iterable<Key>) => {
    treeState.selectionManager.setSelectedKeys(keys);
    validationState.commitValidation();
  };

  return {
    ...overlayState,
    ...treeState,
    ...validationState,
    isFocused,
    setFocused,
    selectedItems,
    setSelectedKeys,
  };
}
