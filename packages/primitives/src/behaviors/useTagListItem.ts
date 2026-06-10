import type { FocusEvent, RefObject } from 'react';
import { useEffect } from 'react';

import type { DOMAttributes, Key, PressEvent } from '@koobiq/react-core';
import {
  filterDOMProps,
  isFocusable,
  mergeProps,
  useDescription,
  useId,
  useInteractionModality,
  useKeyboard,
  useLocalizedStringFormatter,
  usePress,
} from '@koobiq/react-core';
import type { ListState } from '@react-stately/list';

import intlMessages from '../intl/tag-list-item.json';

/** True if Ctrl (Windows/Linux) or Cmd (macOS) is held during the event. */
export function isCommandModifier(event: {
  ctrlKey: boolean;
  metaKey: boolean;
}) {
  return event.ctrlKey || event.metaKey;
}

/**
 * Walks up from `target` to `root` (exclusive) checking whether any element
 * along the way is itself focusable. Used to let nested focusable controls
 * (links, buttons) handle their own interactions instead of being swallowed
 * by the tag's `usePress`.
 */
export function isInteractiveTarget(target: Element, root: Element) {
  let element: Element | null = target;

  while (element && element !== root) {
    if (isFocusable(element)) return true;

    element = element.parentElement;
  }

  return false;
}

export function isSpaceKey(key: string) {
  return key === ' ' || key === 'Space' || key === 'Spacebar';
}

/**
 * Minimal shape `useTagListItem` reads from `item.props`. Renderers can use
 * a richer prop type (icons, slot props, etc.) — only `isDisabled` matters
 * to the headless behavior.
 */
interface AriaTagListItemNodeProps {
  isDisabled?: boolean;
}

export type TagListItemRemoveContext = {
  source: 'keyboard' | 'press';
};

export type AriaTagListItemProps = {
  /** The unique key for the tag. */
  key: Key;
  collectionId?: string;
  onRemove?: (keys: Set<Key>, context?: TagListItemRemoveContext) => void;
  isDisabled?: boolean;
};

export type TagListItemAria = {
  /** Props for the tag row element. */
  rowProps: DOMAttributes;
  /** Props for the tag cell element. */
  gridCellProps: DOMAttributes;
  /** Props for the tag remove button. */
  removeButtonProps: {
    isDisabled: boolean | undefined;
    tabIndex: -1;
    id: string;
    'aria-label': string;
    'aria-labelledby': string;
    onPress: () => void;
  };
  isPressed: boolean;
  isSelected: boolean;
  isDisabled: boolean | undefined;
  allowsRemoving: boolean;
};

export function useTagListItem<T extends object>(
  props: AriaTagListItemProps,
  state: ListState<T>,
  ref: RefObject<HTMLDivElement | null>
): TagListItemAria {
  const { key, collectionId, onRemove, isDisabled: isDisabledProp } = props;

  const rowId = useId();
  const removeButtonId = useId();

  const item = state.collection.getItem(key);
  const itemProps = item?.props as AriaTagListItemNodeProps | undefined;

  const { selectionManager } = state;

  const isSelected = selectionManager.isSelected(key);

  const isDisabled =
    isDisabledProp || selectionManager.isDisabled(key) || itemProps?.isDisabled;

  // The remove affordance stays visible on disabled tags — the button just
  // renders disabled (state propagated via `removeButtonProps.isDisabled`).
  const allowsRemoving = !!onRemove;

  const allowsSelection = !isDisabled && selectionManager.canSelectItem(key);

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  // Screen-reader hint announcing the Delete/Backspace shortcut. We only
  // surface it for keyboard/virtual modalities — pointer users already see
  // the remove button, and reading the hint out loud would be redundant.
  // The `'ontouchstart' in window` heuristic re-classifies touch devices as
  // pointer (same approach as React Aria's `useTag`).
  let modality = useInteractionModality();

  if (
    modality === 'virtual' &&
    typeof window !== 'undefined' &&
    'ontouchstart' in window
  ) {
    modality = 'pointer';
  }

  const description =
    allowsRemoving &&
    !isDisabled &&
    (modality === 'keyboard' || modality === 'virtual')
      ? stringFormatter.format('removeDescription')
      : '';

  const descProps = useDescription(description);

  // Move DOM focus to this tag when it becomes the focused item.
  useEffect(() => {
    if (
      !isDisabled &&
      selectionManager.isFocused &&
      selectionManager.focusedKey === key &&
      document.activeElement !== ref.current
    ) {
      ref.current?.focus();
    }
  }, [isDisabled, key, ref, selectionManager]);

  const focusTag = () => {
    if (isDisabled) return;

    selectionManager.setFocused(true);
    selectionManager.setFocusedKey(key);
    ref.current?.focus();
  };

  const toggleSelection = () => {
    if (allowsSelection) selectionManager.toggleSelection(key);
  };

  const getKeysToRemove = () => {
    if (!isSelected) {
      return new Set([key]);
    }

    const selectedKeys = new Set(
      [...selectionManager.selectedKeys].filter((key) =>
        Boolean(state.collection.getItem(key))
      )
    );

    return selectedKeys.size ? selectedKeys : new Set([key]);
  };

  const handlePressStart = (event: PressEvent) => {
    if (isInteractiveTarget(event.target, ref.current ?? event.target)) {
      event.continuePropagation();

      return;
    }

    focusTag();

    if (event.pointerType === 'keyboard') return;

    if (isCommandModifier(event)) {
      toggleSelection();
    }
  };

  const { pressProps, isPressed } = usePress({
    ref,
    isDisabled,
    onPressStart: handlePressStart,
  });

  const { keyboardProps } = useKeyboard({
    isDisabled,
    onKeyDown: (event) => {
      if (isSpaceKey(event.key)) {
        event.preventDefault();
        toggleSelection();

        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();

        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (!allowsRemoving) {
          event.continuePropagation();

          return;
        }

        event.preventDefault();

        onRemove?.(getKeysToRemove(), { source: 'keyboard' });

        return;
      }

      event.continuePropagation();
    },
  });

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || isDisabled) return;

    selectionManager.setFocused(true);
    selectionManager.setFocusedKey(key);
  };

  const rowProps = mergeProps(
    filterDOMProps(item?.props ?? {}, { global: true }),
    {
      ref,
      id: rowId,
      role: 'row',
      tabIndex: selectionManager.focusedKey === key && !isDisabled ? 0 : -1,
      'aria-disabled': isDisabled || undefined,
      'aria-label': item?.['aria-label'] || item?.textValue || undefined,
      'aria-selected': allowsSelection ? isSelected : undefined,
      'aria-describedby': descProps['aria-describedby'],
      'data-collection': collectionId,
      'data-key': key,
      onFocus: handleFocus,
    },
    pressProps,
    keyboardProps
  );

  const gridCellProps: DOMAttributes = {
    role: 'gridcell',
    'aria-colindex': 1,
  };

  const removeButtonProps = {
    isDisabled,
    tabIndex: -1 as const,
    id: removeButtonId,
    'aria-label': stringFormatter.format('removeButtonLabel'),
    'aria-labelledby': `${removeButtonId} ${rowId}`,
    onPress: () => onRemove?.(new Set([key]), { source: 'press' }),
  };

  return {
    rowProps,
    isPressed,
    isSelected,
    isDisabled,
    gridCellProps,
    allowsRemoving,
    removeButtonProps,
  };
}
