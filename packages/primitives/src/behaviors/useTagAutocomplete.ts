'use client';

import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';

import type { Key } from '@koobiq/react-core';
import { useInteractOutside } from '@koobiq/react-core';
import type { BaseCollection } from '@react-aria/collections';
import type { ListState } from '@react-stately/list';
import { useListState } from '@react-stately/list';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';

export type TagAutocompleteState<T extends object = object> = {
  /** Open/close state for the suggestions popover. */
  state: OverlayTriggerState;
  /** State for the suggestions listbox. */
  listState: ListState<T>;
  /** Fires when a suggestion is picked by mouse or keyboard. */
  onAction: (key: Key) => void;
  /** Ref to the field the popover anchors to. */
  anchorRef: RefObject<HTMLDivElement | null>;
  /** Ref to the popover container. */
  popoverRef: RefObject<HTMLDivElement | null>;
};

export type TagAutocompleteStateProps<T extends object> = {
  /** Collection of autocomplete suggestions. */
  collection: BaseCollection<T>;
  /** Controlled open state for the suggestions popover. */
  isOpen?: boolean;
  /** Uncontrolled initial open state for the suggestions popover. */
  defaultOpen?: boolean;
  /** Fires when the suggestions popover opens or closes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Fires when a suggestion is picked. */
  onSelect?: (item: T) => void;
};

export function useTagAutocompleteState<T extends object>(
  props: TagAutocompleteStateProps<T>
): TagAutocompleteState<T> {
  const { collection, isOpen, defaultOpen, onOpenChange, onSelect } = props;

  const popoverRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const state = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const listState = useListState<T>({
    collection,
    selectionMode: 'none',
  });

  const onAction = useCallback(
    (key: Key) => {
      const item = listState.collection.getItem(key);

      if (item?.value != null) {
        onSelect?.(item.value);
      }
    },
    [listState.collection, onSelect]
  );

  return { state, listState, onAction, anchorRef, popoverRef };
}

export type TagAutocompleteAria<T extends object = object> = {
  listProps: {
    onAction: ((key: Key) => void) | undefined;
    state: ListState<T> | undefined;
    shouldUseVirtualFocus: true;
    'aria-label': string;
  };
  popoverProps: {
    state: OverlayTriggerState | undefined;
    anchorRef: RefObject<HTMLDivElement | null> | undefined;
    popoverRef: RefObject<HTMLDivElement | null> | undefined;
    type: 'listbox';
    isNonModal: true;
  };
};

export function useTagAutocomplete<T extends object>(
  autocomplete?: TagAutocompleteState<T> | null
): TagAutocompleteAria<T> {
  const { state, listState, onAction, popoverRef, anchorRef } =
    autocomplete ?? {};

  const fallbackRef = useRef<HTMLDivElement>(null);

  useInteractOutside({
    ref: popoverRef ?? fallbackRef,
    isDisabled: !state?.isOpen,
    onInteractOutside: (event) => {
      const target = event.target as Element | null;
      if (target && anchorRef?.current?.contains(target)) return;
      state?.close();
    },
  });

  return {
    listProps: {
      onAction,
      state: listState,
      'aria-label': 'suggestions',
      shouldUseVirtualFocus: true,
    },
    popoverProps: {
      state,
      anchorRef,
      popoverRef,
      type: 'listbox' as const,
      isNonModal: true,
    },
  };
}
