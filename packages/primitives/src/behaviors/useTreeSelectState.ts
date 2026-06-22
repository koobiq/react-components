'use client';

import { useMemo, useState } from 'react';

import { useControlledState } from '@koobiq/react-core';
import type {
  FocusableProps,
  HelpTextProps,
  InputBase,
  Key,
  LabelableProps,
  Node,
  TextInputBase,
  Validation,
} from '@koobiq/react-core';
import type { FormValidationState } from '@react-stately/form';
import { useFormValidationState } from '@react-stately/form';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import type { TreeProps, TreeState } from '@react-stately/tree';
import { useTreeState } from '@react-stately/tree';

export type SelectionMode = 'single' | 'multiple';

/** The selection value, typed by the selection mode. */
export type TreeSelectValueType<M extends SelectionMode> = M extends 'single'
  ? Key | null
  : readonly Key[];

/** The value passed to `onChange`, typed by the selection mode. */
export type TreeSelectChangeValueType<M extends SelectionMode> =
  M extends 'single' ? Key | null : Key[];

type TreeSelectValidationValueType<M extends SelectionMode> = M extends 'single'
  ? Key
  : Key[];

export interface TreeSelectStateOptions<
  T extends object,
  M extends SelectionMode = 'single',
>
  extends
    Omit<
      TreeProps<T>,
      | 'selectionMode'
      | 'selectedKeys'
      | 'defaultSelectedKeys'
      | 'onSelectionChange'
      | 'disallowEmptySelection'
    >,
    LabelableProps,
    InputBase,
    TextInputBase,
    HelpTextProps,
    FocusableProps,
    Validation<TreeSelectValidationValueType<M>> {
  /** Whether single or multiple selection is enabled. */
  selectionMode?: M;
  /** The selected key(s) (controlled). */
  value?: TreeSelectValueType<M>;
  /** The initial selected key(s) (uncontrolled). */
  defaultValue?: TreeSelectValueType<M>;
  /** Handler that is called when the selection changes. */
  onChange?: (value: TreeSelectChangeValueType<M>) => void;
  /** Sets the open state of the menu. */
  isOpen?: boolean;
  /** Sets the default open state of the menu. */
  defaultOpen?: boolean;
  /** Method that is called when the open state of the menu changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

export type TreeSelectProps<
  T extends object = object,
  M extends SelectionMode = 'single',
> = TreeSelectStateOptions<T, M>;

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

const convertValue = (
  value: Key | readonly Key[] | null | undefined
): Iterable<Key> | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return [];

  return Array.isArray(value) ? value : [value as Key];
};

export function useTreeSelectState<
  T extends object,
  M extends SelectionMode = 'single',
>(props: TreeSelectStateOptions<T, M>): TreeSelectState<T> {
  const { selectionMode = 'single' as M } = props;

  const [isFocused, setFocused] = useState(false);

  const overlayState = useOverlayTriggerState({
    isOpen: props.isOpen,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  });

  const defaultValue =
    props.defaultValue !== undefined
      ? props.defaultValue
      : selectionMode === 'multiple'
        ? []
        : null;

  const [controlledValue, setControlledValue] = useControlledState<
    Key | readonly Key[] | null
  >(
    props.value,
    defaultValue,
    props.onChange as ((value: Key | readonly Key[] | null) => void) | undefined
  );

  // Only display the first selected key in single mode if the value is an array.
  const displayValue =
    selectionMode === 'single' && Array.isArray(controlledValue)
      ? (controlledValue[0] ?? null)
      : controlledValue;

  const setValue = (value: Key | readonly Key[] | null) => {
    if (selectionMode === 'single') {
      const key = Array.isArray(value) ? (value[0] ?? null) : value;

      setControlledValue(key as Key | null);
    } else {
      let keys: Key[] = [];

      if (Array.isArray(value)) keys = [...value];
      else if (value != null) keys = [value as Key];

      setControlledValue(keys);
    }
  };

  const validationState = useFormValidationState({
    ...props,
    value:
      Array.isArray(displayValue) && displayValue.length === 0
        ? null
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (displayValue as any),
  });

  const treeState = useTreeState({
    ...props,
    selectionMode,
    disallowEmptySelection: selectionMode === 'single',
    selectedKeys: convertValue(displayValue),
    onSelectionChange: (keys) => {
      if (keys === 'all') return;

      if (selectionMode === 'single') {
        const key = keys.values().next().value ?? null;

        setValue(key);
        overlayState.close();
      } else {
        setValue([...keys]);
      }

      validationState.commitValidation();
    },
  } as TreeProps<T>);

  const selectedItems = useMemo(() => {
    return [...treeState.selectionManager.selectedKeys]
      .map((key) => treeState.collection.getItem(key))
      .filter((item) => item != null);
  }, [treeState.selectionManager.selectedKeys, treeState.collection]);

  const setSelectedKeys = (keys: Iterable<Key>) => {
    treeState.selectionManager.setSelectedKeys(keys);
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
