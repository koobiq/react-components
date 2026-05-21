import type { FocusEvent } from 'react';
import { useEffect, useRef } from 'react';

import {
  useId,
  usePress,
  useKeyboard,
  mergeProps,
  isFocusable,
  filterDOMProps,
  useDescription,
  useInteractionModality,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import type { Key, Node, PressEvent, DOMAttributes } from '@koobiq/react-core';
import type { ListState } from '@koobiq/react-primitives';

import { getTagListItemProps } from '../components/TagItem/utils';
import intlMessages from '../intl.json';

export type UseTagListItemProps<T extends object> = {
  state: ListState<T>;
  collectionId?: string;
  item: Node<T>;
  onRemove?: (keys: Set<Key>) => void;
};

export function isCommandModifier(event: {
  ctrlKey: boolean;
  metaKey: boolean;
}) {
  return event.ctrlKey || event.metaKey;
}

// Nested focusable controls handle their own interactions.
export function isInteractiveTarget(target: Element, root: Element) {
  let element: Element | null = target;

  while (element && element !== root) {
    if (isFocusable(element)) return true;

    element = element.parentElement;
  }

  return false;
}

function isSpaceKey(key: string) {
  return key === ' ' || key === 'Space' || key === 'Spacebar';
}

export function useTagListItem<T extends object>(
  props: UseTagListItemProps<T>
) {
  const { collectionId, item, onRemove, state } = props;

  const ref = useRef<HTMLDivElement>(null);
  const rowId = useId();
  const removeButtonId = useId();

  const itemProps = getTagListItemProps(item);

  const { selectionManager } = state;

  const isSelected = selectionManager.isSelected(item.key);
  const isDisabled =
    selectionManager.isDisabled(item.key) || itemProps.isDisabled;

  const allowsRemoving = !!onRemove && !isDisabled;

  const allowsSelection =
    !isDisabled && selectionManager.canSelectItem(item.key);

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
    allowsRemoving && (modality === 'keyboard' || modality === 'virtual')
      ? stringFormatter.format('removeDescription')
      : '';

  const descProps = useDescription(description);

  // Move DOM focus to this tag when it becomes the focused item.
  useEffect(() => {
    if (
      !isDisabled &&
      selectionManager.isFocused &&
      selectionManager.focusedKey === item.key &&
      document.activeElement !== ref.current
    ) {
      ref.current?.focus();
    }
  }, [isDisabled, item.key, selectionManager]);

  const focusTag = () => {
    if (isDisabled) return;

    selectionManager.setFocused(true);
    selectionManager.setFocusedKey(item.key);
    ref.current?.focus();
  };

  const toggleSelection = () => {
    if (allowsSelection) selectionManager.toggleSelection(item.key);
  };

  const getKeysToRemove = () => {
    if (!isSelected) {
      return new Set([item.key]);
    }

    const selectedKeys = new Set(
      [...selectionManager.selectedKeys].filter((key) =>
        Boolean(state.collection.getItem(key))
      )
    );

    return selectedKeys.size ? selectedKeys : new Set([item.key]);
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

        onRemove?.(getKeysToRemove());

        return;
      }

      event.continuePropagation();
    },
  });

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || isDisabled) return;

    selectionManager.setFocused(true);
    selectionManager.setFocusedKey(item.key);
  };

  const tagProps = mergeProps(
    filterDOMProps(item.props, { global: true }),
    {
      ref,
      id: rowId,
      role: 'row',
      tabIndex:
        selectionManager.focusedKey === item.key && !isDisabled ? 0 : -1,
      'aria-disabled': isDisabled || undefined,
      'aria-label': item['aria-label'] || item.textValue || undefined,
      'aria-selected': allowsSelection ? isSelected : undefined,
      'aria-describedby': descProps['aria-describedby'],
      'data-collection': collectionId,
      'data-key': item.key,
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
    tabIndex: -1,
    id: removeButtonId,
    'aria-label': stringFormatter.format('removeButtonLabel'),
    'aria-labelledby': `${removeButtonId} ${rowId}`,
    onPress: () => onRemove?.(new Set([item.key])),
  };

  return {
    tagProps,
    isPressed,
    isSelected,
    isDisabled,
    gridCellProps,
    allowsRemoving,
    removeButtonProps,
  };
}
