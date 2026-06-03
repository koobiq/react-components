'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';

import type {
  CollectionChildren,
  FocusStrategy,
  Key,
  Node,
  Selection,
} from '@koobiq/react-core';
import { useControlledState, useInteractOutside } from '@koobiq/react-core';
import { listData } from '@react-aria/listbox';
import { useId } from '@react-aria/utils';
import type { ListState } from '@react-stately/list';
import { useListState } from '@react-stately/list';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';

import type { TagFieldAddContext } from './useTagField';
import { useTagListState } from './useTagListState';
import type { TagListState } from './useTagListState';

export type TagAutocompleteFilter = (
  textValue: string,
  inputValue: string
) => boolean;

const normalizeTextValue = (value: string) => value.trim().toLocaleLowerCase();

export type TagAutocompleteState<T extends object = object> = {
  /** Tag list state (selected tags). */
  tagListState: TagListState<T>;
  /** State for the filtered suggestions listbox. */
  listState: ListState<T>;
  /** Current text value inside the owning tag field. */
  inputValue: string;
  /** Updates the owning tag field text value. */
  setInputValue: (value: string) => void;
  /** Resolved disabled state for the owning field. */
  isDisabled: boolean | undefined;
  /** Resolved read-only state for the owning field. */
  isReadOnly: boolean | undefined;
  /** Open/close state for the suggestions popover. */
  overlayState: OverlayTriggerState;
  /** Fires when a suggestion is picked by mouse or keyboard. */
  onAction: (key: Key) => void;
  /** Ref to the popover container. */
  popoverRef: RefObject<HTMLDivElement | null>;
  /** Ref to the listbox element. */
  listBoxRef: RefObject<HTMLUListElement | null>;
  /** DOM id for the listbox element. */
  listBoxId: string;
  /** Which item should receive virtual focus when the listbox opens. */
  focusStrategy: FocusStrategy | undefined;
  /** Opens the suggestions popover and optionally focuses the first/last item. */
  open: (focusStrategy?: FocusStrategy) => void;
  /** Closes the suggestions popover. */
  close: () => void;
};

export type TagAutocompleteStateProps<T extends object> = {
  /** Tag collection items. */
  items?: Iterable<T>;
  /** Render function for each selected tag. */
  children?: CollectionChildren<T>;
  /** Keys of tags rendered as disabled. */
  disabledKeys?: Iterable<Key>;
  /** Controlled set of selected tag keys. */
  selectedKeys?: Selection;
  /** Uncontrolled initial set of selected tag keys. */
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  /** Fires when the selected tag keys change. */
  onSelectionChange?: (keys: Selection) => void;
  /** Collection of autocomplete suggestions. */
  suggestionItems?: Iterable<T>;
  /** Render function for each suggestion. */
  suggestionChildren: CollectionChildren<T>;
  /** Filters suggestions by the current input value. */
  defaultFilter?: TagAutocompleteFilter;
  /** Controlled text input value. */
  inputValue?: string;
  /** Uncontrolled initial text input value. */
  defaultInputValue?: string;
  /** Fires whenever the text input value changes. */
  onInputChange?: (value: string) => void;
  /** Fires when a suggestion is committed as a tag. */
  onAdd?: (values: string[], context: TagFieldAddContext<T>) => void;
  /** Whether the owning field is disabled. */
  isDisabled?: boolean;
  /** Whether the owning field is read-only. */
  isReadOnly?: boolean;
  /** Controlled open state for the suggestions popover. */
  isOpen?: boolean;
  /** Uncontrolled initial open state for the suggestions popover. */
  defaultOpen?: boolean;
  /** Fires when the suggestions popover opens or closes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Ref to the field the popover anchors to. */
  anchorRef: RefObject<HTMLDivElement | null>;
  /** Ref to the popover container. */
  popoverRef: RefObject<HTMLDivElement | null>;
  /** Ref to the listbox element. */
  listBoxRef: RefObject<HTMLUListElement | null>;
};

export function useTagAutocompleteState<T extends object>(
  props: TagAutocompleteStateProps<T>
): TagAutocompleteState<T> {
  const {
    items,
    children,
    disabledKeys,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    suggestionItems,
    suggestionChildren,
    defaultFilter,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputChange,
    onAdd,
    isDisabled,
    isReadOnly,
    isOpen,
    defaultOpen,
    onOpenChange,
    popoverRef,
    listBoxRef,
  } = props;

  const listBoxId = useId();

  const tagListState = useTagListState<T>({
    items,
    children,
    disabledKeys,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    selectionMode: isReadOnly ? 'none' : 'multiple',
  });

  const [inputValue, setInputValue] = useControlledState<string>(
    inputValueProp,
    defaultInputValue ?? '',
    onInputChange
  );

  // Pre-compute normalized textValues of currently-selected tags so the
  // filter can exclude already-picked items even when their keys don't
  // match the suggestion's key (e.g. free-text tags vs preset suggestions).
  const selectedTextValues = useMemo(() => {
    const values = new Set<string>();

    for (const item of tagListState.collection) {
      const textValue = normalizeTextValue(item.textValue ?? '');

      if (textValue) {
        values.add(textValue);
      }
    }

    return values;
  }, [tagListState.collection]);

  const filter = useCallback(
    (nodes: Iterable<Node<T>>): Iterable<Node<T>> => {
      const filtered: Node<T>[] = [];

      for (const node of nodes) {
        // Exclude already-selected items by stable key.
        if (tagListState.collection.getItem(node.key)) continue;

        // Exclude already-selected items by normalized textValue match.
        const normalizedTextValue = normalizeTextValue(node.textValue ?? '');

        if (normalizedTextValue && selectedTextValues.has(normalizedTextValue))
          continue;

        // User-supplied filter by current input value.
        if (
          inputValue &&
          defaultFilter &&
          !defaultFilter(node.textValue ?? '', inputValue)
        )
          continue;

        filtered.push(node);
      }

      return filtered;
    },
    [tagListState.collection, selectedTextValues, inputValue, defaultFilter]
  );

  const listState = useListState<T>({
    items: suggestionItems,
    children: suggestionChildren,
    selectionMode: 'none',
    filter,
  });

  const [focusStrategy, setFocusStrategy] = useState<
    FocusStrategy | undefined
  >();

  const overlayState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const {
    open: openOverlay,
    close: closeOverlay,
    isOpen: isOverlayOpen,
  } = overlayState;

  const open = useCallback(
    (focusStrategy?: FocusStrategy) => {
      setFocusStrategy(focusStrategy);
      openOverlay();
    },
    [openOverlay]
  );

  const close = useCallback(() => {
    setFocusStrategy(undefined);
    closeOverlay();
  }, [closeOverlay]);

  useEffect(() => {
    if (!isOverlayOpen) {
      setFocusStrategy(undefined);
    }
  }, [isOverlayOpen]);

  const onAction = useCallback(
    (key: Key) => {
      const node = listState.collection.getItem(key);

      if (node?.value == null || !onAdd || isDisabled || isReadOnly) {
        return;
      }

      onAdd([node.textValue ?? ''], {
        source: 'suggestion',
        suggestion: node.value,
      });

      setInputValue('');
    },
    [isDisabled, isReadOnly, listState.collection, onAdd, setInputValue]
  );

  return {
    tagListState,
    listState,
    inputValue,
    setInputValue,
    isDisabled,
    isReadOnly,
    overlayState,
    onAction,
    popoverRef,
    listBoxRef,
    listBoxId,
    focusStrategy,
    open,
    close,
  };
}

export type TagAutocompleteAria<T extends object = object> = {
  /** Props to spread on `TagInputField`. */
  tagFieldProps: {
    state: TagAutocompleteState<T>;
  };
  /** Props to spread on the suggestion popover. */
  popoverProps: {
    state: OverlayTriggerState;
    anchorRef: RefObject<HTMLDivElement | null>;
    popoverRef: RefObject<HTMLDivElement | null>;
    type: 'listbox';
    isNonModal: true;
  };
  /** Props to spread on the suggestion listbox. */
  listProps: {
    onAction: (key: Key) => void;
    state: ListState<T>;
    listRef: RefObject<HTMLUListElement | null>;
    autoFocus: true | FocusStrategy;
    shouldUseVirtualFocus: true;
    'aria-label': string;
    id: string;
  };
};

export function useTagAutocomplete<T extends object>(
  props: TagAutocompleteStateProps<T>,
  state: TagAutocompleteState<T>
): TagAutocompleteAria<T> {
  const { anchorRef, popoverRef, listBoxRef } = props;

  const { overlayState, listState, onAction, listBoxId, focusStrategy, close } =
    state;

  useInteractOutside({
    ref: popoverRef,
    isDisabled: !overlayState.isOpen,
    onInteractOutside: (event) => {
      const target = event.target as Element | null;
      if (target && anchorRef.current?.contains(target)) return;

      close();
    },
  });

  listData.set(listState, {
    id: listBoxId,
    shouldUseVirtualFocus: true,
    onAction,
  });

  return {
    tagFieldProps: {
      state,
    },
    popoverProps: {
      state: overlayState,
      anchorRef,
      popoverRef,
      type: 'listbox',
      isNonModal: true,
    },
    listProps: {
      onAction,
      id: listBoxId,
      state: listState,
      listRef: listBoxRef,
      shouldUseVirtualFocus: true,
      'aria-label': 'suggestions',
      autoFocus: focusStrategy || true,
    },
  };
}
