'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';

import type { FocusStrategy, Key, Node } from '@koobiq/react-core';
import { useInteractOutside } from '@koobiq/react-core';
import { listData } from '@react-aria/listbox';
import { useId } from '@react-aria/utils';
import type { ListState } from '@react-stately/list';
import { useListState } from '@react-stately/list';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';

import type { TagFieldState, TagFieldStateProps } from './useTagField';
import { useTagFieldState } from './useTagField';

export type TagAutocompleteFilter = (
  textValue: string,
  inputValue: string
) => boolean;

const normalizeTextValue = (value: string) => value.trim().toLocaleLowerCase();

type TagAutocompleteRefProps = {
  /** Ref to the field the popover anchors to. */
  anchorRef: RefObject<HTMLDivElement | null>;
  /** Ref to the popover container. */
  popoverRef: RefObject<HTMLDivElement | null>;
  /** Ref to the listbox element. */
  listBoxRef: RefObject<HTMLUListElement | null>;
};

const tagAutocompletePropKeys = [
  'listItems',
  'renderListItem',
  'defaultFilter',
  'isOpen',
  'defaultOpen',
  'onOpenChange',
  'allowsEmptyCollection',
  'anchorRef',
  'popoverRef',
  'listBoxRef',
] as const;

type TagAutocompletePropKey = (typeof tagAutocompletePropKeys)[number];

function getTagFieldProps<T extends object>(
  props: TagAutocompleteProps<T>
): TagFieldStateProps<T> {
  const tagFieldProps = { ...props };

  for (const key of tagAutocompletePropKeys) {
    delete (tagFieldProps as Partial<Record<TagAutocompletePropKey, unknown>>)[
      key
    ];
  }

  return tagFieldProps;
}

export type TagAutocompleteState<T extends object = object> =
  TagFieldState<T> & {
    /** State for the filtered suggestions listbox. */
    listState: ListState<T>;
    /** Open/close state for the suggestions popover. */
    overlayState: OverlayTriggerState;
    /** Fires when a suggestion is picked by mouse or keyboard. */
    onAction: (key: Key) => void;
    /** DOM id for the listbox element. */
    listBoxId: string;
    /** Which item should receive virtual focus when the listbox opens. */
    focusStrategy: FocusStrategy | undefined;
    /** Opens the suggestions popover and optionally focuses the first/last item. */
    open: (focusStrategy?: FocusStrategy) => void;
    /** Closes the suggestions popover. */
    close: () => void;
  };

export type TagAutocompleteStateProps<T extends object> =
  TagFieldStateProps<T> & {
    /** Collection of autocomplete suggestions. */
    listItems?: Iterable<T>;
    /** Render function for each suggestion. */
    renderListItem: TagFieldStateProps<T>['children'];
    /** Filters suggestions by the current input value. */
    defaultFilter?: TagAutocompleteFilter;
    /** Controlled open state for the suggestions popover. */
    isOpen?: boolean;
    /** Uncontrolled initial open state for the suggestions popover. */
    defaultOpen?: boolean;
    /** Fires when the suggestions popover opens or closes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Whether the suggestions popover can be open when the collection is empty. */
    allowsEmptyCollection?: boolean;
  };

export function useTagAutocompleteState<T extends object>(
  props: TagAutocompleteStateProps<T>
): TagAutocompleteState<T> {
  const {
    listItems,
    renderListItem,
    defaultFilter,
    onAdd,
    isDisabled,
    isReadOnly,
    isOpen,
    defaultOpen,
    onOpenChange,
    allowsEmptyCollection = false,
  } = props;

  const listBoxId = useId();

  const tagFieldState = useTagFieldState(props);

  const selectedTextValues = useMemo(() => {
    const values = new Set<string>();

    for (const item of tagFieldState.collection) {
      const textValue = normalizeTextValue(item.textValue ?? '');

      if (textValue) {
        values.add(textValue);
      }
    }

    return values;
  }, [tagFieldState.collection]);

  const filter = useCallback(
    (nodes: Iterable<Node<T>>): Iterable<Node<T>> => {
      const filtered: Node<T>[] = [];

      for (const node of nodes) {
        if (tagFieldState.collection.getItem(node.key)) continue;

        const normalizedTextValue = normalizeTextValue(node.textValue ?? '');

        if (normalizedTextValue && selectedTextValues.has(normalizedTextValue))
          continue;

        if (
          tagFieldState.inputValue &&
          defaultFilter &&
          !defaultFilter(node.textValue ?? '', tagFieldState.inputValue)
        )
          continue;

        filtered.push(node);
      }

      return filtered;
    },
    [
      defaultFilter,
      selectedTextValues,
      tagFieldState.collection,
      tagFieldState.inputValue,
    ]
  );

  const listState = useListState<T>({
    items: listItems,
    children: renderListItem,
    selectionMode: 'none',
    filter,
  });

  const overlayState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const canShowCollection =
    allowsEmptyCollection || listState.collection.size > 0;

  const visibleOverlayState = useMemo<OverlayTriggerState>(
    () => ({
      ...overlayState,
      isOpen: overlayState.isOpen && canShowCollection,
    }),
    [canShowCollection, overlayState]
  );

  const { setInputValue } = tagFieldState;

  const [focusStrategy, setFocusStrategy] = useState<
    FocusStrategy | undefined
  >();

  const {
    open: openOverlay,
    close: closeOverlay,
    isOpen: isOverlayOpen,
  } = visibleOverlayState;

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
    ...tagFieldState,
    listState,
    overlayState: visibleOverlayState,
    onAction,
    listBoxId,
    focusStrategy,
    open,
    close,
  };
}

export type TagAutocompleteAria<T extends object = object> = {
  /** Props to spread on `TagInputField`. */
  tagFieldProps: TagFieldStateProps<T> & {
    state: TagAutocompleteState<T>;
    popoverRef: RefObject<HTMLDivElement | null>;
    listBoxRef: RefObject<HTMLUListElement | null>;
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

export type AriaTagAutocompleteProps<T extends object> =
  TagAutocompleteStateProps<T>;

export type TagAutocompleteProps<T extends object> =
  AriaTagAutocompleteProps<T> & TagAutocompleteRefProps;

export function useTagAutocomplete<T extends object>(
  props: TagAutocompleteProps<T>,
  state: TagAutocompleteState<T>
): TagAutocompleteAria<T> {
  const { anchorRef, popoverRef, listBoxRef } = props;

  const tagFieldProps = getTagFieldProps(props);

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
      ...tagFieldProps,
      state,
      popoverRef,
      listBoxRef,
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
