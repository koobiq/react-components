import { useMemo } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

import type {
  DOMAttributes,
  FocusStrategy,
  RefObject as AriaRefObject,
} from '@koobiq/react-core';
import { mergeProps, useFocusWithin, useLocale } from '@koobiq/react-core';
import { ListKeyboardDelegate, useSelectableList } from '@react-aria/selection';
import type { ListState } from '@react-stately/list';
import type { MultipleSelectionManager } from '@react-stately/selection';

const extendSelectionMethod: keyof MultipleSelectionManager = 'extendSelection';

const noopExtendSelection: MultipleSelectionManager['extendSelection'] = () =>
  undefined;

export type AriaTagListProps = {
  /**
   * Whether pressing the Escape key should clear selection.
   * @default 'clearSelection'
   */
  escapeKeyBehavior?: 'clearSelection' | 'none';
  /** Focus the first (`true` / `'first'`) or last (`'last'`) tag on mount. */
  autoFocus?: boolean | FocusStrategy;
};

export type TagListAria = {
  /** Props for the root grid/group element. */
  gridProps: DOMAttributes;
  collectionId: string | undefined;
};

/**
 * Provides behavior and accessibility wiring for a TagList root.
 * Pair with `useTagListState` for state and `useTagListItem` for tags.
 */
export function useTagList<T extends object>(
  props: AriaTagListProps,
  state: ListState<T>,
  ref: RefObject<HTMLElement | null>
): TagListAria {
  const { escapeKeyBehavior, autoFocus } = props;
  const { direction } = useLocale();

  const keyboardDelegate = useMemo(
    () =>
      new ListKeyboardDelegate({
        collection: state.collection,
        direction,
        disabledBehavior: state.selectionManager.disabledBehavior,
        disabledKeys: state.disabledKeys,
        orientation: 'horizontal',
        ref: ref as AriaRefObject<HTMLElement | null>,
      }),
    [
      ref,
      direction,
      state.collection,
      state.disabledKeys,
      state.selectionManager.disabledBehavior,
    ]
  );

  // Let React Aria keep owning keyboard focus movement, but disable its
  // range-selection branch for tags.
  const selectionManagerWithoutRangeSelection = useMemo(
    () =>
      new Proxy(state.selectionManager, {
        get(target, property) {
          if (property === extendSelectionMethod) {
            return noopExtendSelection;
          }

          const value = Reflect.get(target, property, target);

          return typeof value === 'function' ? value.bind(target) : value;
        },
      }) as MultipleSelectionManager,
    [state.selectionManager]
  );

  const { listProps } = useSelectableList({
    keyboardDelegate,
    // Spec: arrow navigation in the tag list is not cyclic.
    shouldFocusWrap: false,
    escapeKeyBehavior,
    autoFocus,
    collection: state.collection,
    disabledKeys: state.disabledKeys,
    selectionManager: selectionManagerWithoutRangeSelection,
    ref: ref as AriaRefObject<HTMLElement | null>,
  });

  // Clear selection when focus leaves the group.
  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => state.selectionManager.clearSelection(),
  });

  const { onKeyDown: selectableKeyDown, ...selectableListProps } = listProps;

  const { 'data-collection': collectionId } = selectableListProps as {
    'data-collection'?: string;
  };

  const isArrowKey = (key: string) =>
    key === 'ArrowDown' ||
    key === 'ArrowUp' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight';

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;

    if (
      event.shiftKey &&
      (event.metaKey || event.ctrlKey || event.altKey) &&
      isArrowKey(event.key)
    ) {
      event.preventDefault();

      return;
    }

    selectableKeyDown?.(event);

    // Keep the page from scrolling while arrow-navigating the tags — the
    // collection only calls preventDefault when it actually moves focus.
    if (isArrowKey(event.key)) {
      event.preventDefault();
    }
  };

  return {
    gridProps: mergeProps(
      {
        role: state.collection.size ? 'grid' : 'group',
      },
      selectableListProps,
      { onKeyDown },
      focusWithinProps
    ),
    collectionId,
  };
}
