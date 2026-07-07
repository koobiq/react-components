import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

import type { FocusStrategy, Key } from '@koobiq/react-core';
import type { ListKeyboardDelegate } from '@react-aria/selection';
import { isCtrlKeyPressed } from '@react-aria/utils';
import type { ListState } from '@react-stately/list';

import { addTagListRangeSelection } from '../utils';

type RangeNavigationTarget = {
  key: Key;
  childFocus?: FocusStrategy;
};

type UseTagListRangeSelectionProps<T extends object> = {
  state: ListState<T>;
  direction: 'ltr' | 'rtl';
  keyboardDelegate: ListKeyboardDelegate<T>;
};

export function useTagListRangeSelection<T extends object>({
  state,
  direction,
  keyboardDelegate,
}: UseTagListRangeSelectionProps<T>) {
  const rangeAnchorRef = useRef<Key | null>(null);
  const rangeCurrentRef = useRef<Key | null>(null);
  const rangeSelectedKeysRef = useRef<Set<Key> | null>(null);

  const clearRangeSelection = () => {
    rangeAnchorRef.current = null;
    rangeCurrentRef.current = null;
    rangeSelectedKeysRef.current = null;
  };

  const resetStaleRangeAnchor = () => {
    const { focusedKey, selectedKeys } = state.selectionManager;

    if (
      rangeCurrentRef.current != null &&
      rangeCurrentRef.current !== focusedKey
    ) {
      clearRangeSelection();

      return;
    }

    if (
      rangeSelectedKeysRef.current != null &&
      !areKeySetsEqual(rangeSelectedKeysRef.current, selectedKeys)
    ) {
      clearRangeSelection();
    }
  };

  const getRangeNavigationTarget = (
    event: KeyboardEvent<HTMLElement>
  ): RangeNavigationTarget | null => {
    const { selectionManager } = state;
    const { focusedKey } = selectionManager;

    if (
      !event.shiftKey ||
      selectionManager.selectionMode !== 'multiple' ||
      focusedKey == null
    ) {
      return null;
    }

    switch (event.key) {
      case 'ArrowDown':
        return toRangeNavigationTarget(
          keyboardDelegate.getKeyBelow?.(focusedKey)
        );
      case 'ArrowUp':
        return toRangeNavigationTarget(
          keyboardDelegate.getKeyAbove?.(focusedKey)
        );
      case 'ArrowLeft':
        return toRangeNavigationTarget(
          keyboardDelegate.getKeyLeftOf?.(focusedKey),
          direction === 'rtl' ? 'first' : 'last'
        );
      case 'ArrowRight':
        return toRangeNavigationTarget(
          keyboardDelegate.getKeyRightOf?.(focusedKey),
          direction === 'rtl' ? 'last' : 'first'
        );
      case 'PageDown':
        return toRangeNavigationTarget(
          keyboardDelegate.getKeyPageBelow?.(focusedKey)
        );
      case 'PageUp':
        return toRangeNavigationTarget(
          keyboardDelegate.getKeyPageAbove?.(focusedKey)
        );
      case 'Home':
        return isCtrlKeyPressed(event)
          ? toRangeNavigationTarget(keyboardDelegate.getFirstKey?.())
          : null;
      case 'End':
        return isCtrlKeyPressed(event)
          ? toRangeNavigationTarget(keyboardDelegate.getLastKey?.())
          : null;
      default:
        return null;
    }
  };

  const extendRangeSelection = (anchorKey: Key | null, currentKey: Key) => {
    if (anchorKey == null) return false;

    const previousRange =
      rangeAnchorRef.current != null && rangeCurrentRef.current != null
        ? {
            anchorKey: rangeAnchorRef.current,
            currentKey: rangeCurrentRef.current,
          }
        : undefined;

    const selectedKeys = addTagListRangeSelection(
      state,
      anchorKey,
      currentKey,
      previousRange
    );

    if (selectedKeys) {
      rangeAnchorRef.current = anchorKey;
      rangeCurrentRef.current = currentKey;
      rangeSelectedKeysRef.current = selectedKeys;
    }

    return Boolean(selectedKeys);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    resetStaleRangeAnchor();

    const rangeTarget = getRangeNavigationTarget(event);

    if (!rangeTarget) return false;

    const anchorKey =
      rangeAnchorRef.current ?? state.selectionManager.focusedKey;

    event.preventDefault();

    state.selectionManager.setFocusedKey(
      rangeTarget.key,
      rangeTarget.childFocus
    );

    extendRangeSelection(anchorKey, rangeTarget.key);

    return true;
  };

  return { clearRangeSelection, onKeyDown };
}

function toRangeNavigationTarget(
  key: Key | null | undefined,
  childFocus?: FocusStrategy
): RangeNavigationTarget | null {
  return key != null ? { key, childFocus } : null;
}

function areKeySetsEqual(a: Set<Key>, b: Set<Key>) {
  if (a.size !== b.size) return false;

  for (const key of a) {
    if (!b.has(key)) return false;
  }

  return true;
}
