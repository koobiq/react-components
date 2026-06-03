'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import type { FocusStrategy, Key } from '@koobiq/react-core';
import { useInteractOutside } from '@koobiq/react-core';
import type { BaseCollection } from '@react-aria/collections';
import { listData } from '@react-aria/listbox';
import { useId } from '@react-aria/utils';
import type { ListState } from '@react-stately/list';
import { useListState } from '@react-stately/list';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';

export type TagAutocompleteState<T extends object = object> = {
  /** Open/close state for the suggestions popover. */
  overlayState: OverlayTriggerState;
  /** State for the suggestions listbox. */
  listState: ListState<T>;
  /** Fires when a suggestion is picked by mouse or keyboard. */
  onAction: (key: Key) => void;
  /** Ref to the field the popover anchors to. */
  anchorRef: RefObject<HTMLDivElement | null>;
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
  const listBoxRef = useRef<HTMLUListElement>(null);
  const listBoxId = useId();

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

  return {
    overlayState,
    listState,
    onAction,
    anchorRef,
    popoverRef,
    listBoxRef,
    listBoxId,
    focusStrategy,
    open,
    close,
  };
}

export type TagAutocompleteAria<T extends object = object> = {
  listProps: {
    onAction: (key: Key) => void;
    state: ListState<T>;
    autoFocus: true | FocusStrategy;
    shouldUseVirtualFocus: true;
    'aria-label': string;
    id: string;
    listRef: RefObject<HTMLUListElement | null>;
  };
  popoverProps: {
    state: OverlayTriggerState;
    anchorRef: RefObject<HTMLDivElement | null>;
    popoverRef: RefObject<HTMLDivElement | null>;
    type: 'listbox';
    isNonModal: true;
  };
};

export function useTagAutocomplete<T extends object>(
  autocomplete: TagAutocompleteState<T>
): TagAutocompleteAria<T> {
  const {
    overlayState,
    listState,
    onAction,
    popoverRef,
    anchorRef,
    listBoxRef,
    listBoxId,
    focusStrategy,
    close,
  } = autocomplete;

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
    listProps: {
      onAction,
      id: listBoxId,
      state: listState,
      listRef: listBoxRef,
      shouldUseVirtualFocus: true,
      'aria-label': 'suggestions',
      autoFocus: focusStrategy || true,
    },
    popoverProps: {
      state: overlayState,
      anchorRef,
      popoverRef,
      type: 'listbox' as const,
      isNonModal: true,
    },
  };
}
