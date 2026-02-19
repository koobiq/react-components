'use client';

import { useElementSize } from '../useElementSize';
import { useRefs } from '../useRefs';
import { useResizeObserverRefs } from '../useResizeObserverRefs';

const createMap = (length: number, moreIndex: number, pinnedIndex?: number) => {
  const map = new Array(length).fill(null).map((_, i) => i !== moreIndex);

  if (
    typeof pinnedIndex === 'number' &&
    pinnedIndex >= 0 &&
    pinnedIndex < length
  ) {
    map[pinnedIndex] = true;
  }

  return map;
};

const calcItemsVisibleSize = (itemsSizes: number[], map: boolean[]) => {
  let sum = 0;

  for (let index = 0; index < map.length; index++) {
    sum += map[index] ? itemsSizes[index] : 0;
  }

  return sum;
};

export type UseHideOverflowItemsProps = {
  /** Total number of items in the line (including the "more" item). */
  length: number;
  /**
   * Index of the "more" item (defaults to the last one).
   * @default (length - 1)
   */
  moreIndex?: number;
  /**
   * Reserved space in pixels to exclude.
   * @default 0
   */
  busy?: number;
  /**
   * Dependencies that trigger recalculation when changed.
   * @default []
   */
  deps?: unknown[];
  /** Index that should always remain visible. */
  pinnedIndex?: number;
};

export function useHideOverflowItems<
  Item extends HTMLElement = HTMLDivElement,
  Parent extends HTMLElement = HTMLDivElement,
>({
  length,
  moreIndex = length - 1,
  busy = 0,
  deps = [],
  pinnedIndex,
}: UseHideOverflowItemsProps) {
  const { ref: parentRef, width: parentSize } = useElementSize<Parent>();

  const itemsRefs = useRefs<Item>(length, deps);

  const itemsSizes = useResizeObserverRefs(itemsRefs, (el) => {
    if (el) {
      const { marginInlineStart, marginInlineEnd } = getComputedStyle(el);

      return (
        parseInt(marginInlineStart, 10) +
        parseInt(marginInlineEnd, 10) +
        el.getBoundingClientRect().width
      );
    }

    return 0;
  });

  const map = createMap(length, moreIndex, pinnedIndex);

  const hideByIndex = (index: number) => {
    if (!itemsSizes[index] || index === moreIndex || index === pinnedIndex) {
      return;
    }

    const itemsSize = calcItemsVisibleSize(itemsSizes, map);

    if (itemsSize + busy > parentSize) {
      map[index] = false;
      map[moreIndex] = true;
    }
  };

  for (let index = 0; index < itemsSizes.length; index++) {
    // Hide the element to the left of "more"
    hideByIndex(moreIndex - index);
    // Hide the element to the right of "more"
    hideByIndex(moreIndex + index);
  }

  return {
    visibleMap: map,
    itemsRefs,
    parentRef,
    parentSize,
  };
}
