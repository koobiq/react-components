import { useMemo } from 'react';
import type { RefObject } from 'react';

import type {
  DOMAttributes,
  FocusStrategy,
  RefObject as AriaRefObject,
} from '@koobiq/react-core';
import { mergeProps, useFocusWithin, useLocale } from '@koobiq/react-core';
import { ListKeyboardDelegate, useSelectableList } from '@react-aria/selection';
import type { ListState } from '@react-stately/list';

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

  const { listProps } = useSelectableList({
    keyboardDelegate,
    // Spec: arrow navigation in the tag list is not cyclic.
    shouldFocusWrap: false,
    escapeKeyBehavior,
    autoFocus,
    collection: state.collection,
    disabledKeys: state.disabledKeys,
    selectionManager: state.selectionManager,
    ref: ref as AriaRefObject<HTMLElement | null>,
  });

  // Clear selection when focus leaves the group.
  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => state.selectionManager.clearSelection(),
  });

  return {
    gridProps: mergeProps(
      {
        role: state.collection.size ? 'grid' : 'group',
      },
      listProps,
      focusWithinProps
    ),
  };
}
