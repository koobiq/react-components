import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { setParentWidth } from '../useElementSize';
import { setItemSizes } from '../useResizeObserverRefs';

import { useHideOverflowItems } from './useHideOverflowItems';

declare module '../useResizeObserverRefs' {
  export const setItemSizes: (sizes: number[]) => void;
}

declare module '../useElementSize' {
  export const setParentWidth: (width: number) => void;
}

// --- MOCKS ---------------------------------------------------------------
let parentWidth = 0;
let itemSizes: number[] = [];

vi.mock('../useElementSize', () => ({
  useElementSize: <T extends HTMLElement = HTMLDivElement>() => ({
    ref: { current: null } as unknown as React.RefObject<T>,
    width: parentWidth,
  }),
  setParentWidth: (w: number) => {
    parentWidth = w;
  },
}));

vi.mock('../useRefs', () => ({
  useRefs: <T extends HTMLElement = HTMLDivElement>(length: number) =>
    Array.from({ length }, () => ({
      current: null,
    })) as unknown as React.RefObject<T>[],
}));

vi.mock('../useResizeObserverRefs', () => ({
  useResizeObserverRefs: () => itemSizes,
  setItemSizes: (sizes: number[]) => {
    itemSizes = sizes.slice();
  },
}));

// ------------------------------------------------------------------------

describe('useHideOverflowItems', () => {
  beforeEach(() => {
    setParentWidth(0);
    setItemSizes([]);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns all items visible (except "more") when everything fits', () => {
    setParentWidth(200);
    setItemSizes([30, 40, 50, 60]); // sum without "more" = 120

    const { result } = renderHook(() =>
      useHideOverflowItems({ length: 4, moreIndex: 3 })
    );

    expect(result.current.parentSize).toBe(200);
    expect(result.current.visibleMap).toEqual([true, true, true, false]);
  });

  it('hides from the end (left of "more") when overflowing', () => {
    setParentWidth(80);
    setItemSizes([30, 30, 30, 30]); // sum without "more" = 90

    const { result } = renderHook(() =>
      useHideOverflowItems({ length: 4, moreIndex: 3 })
    );

    expect(result.current.visibleMap).toEqual([true, false, false, true]);
  });

  it('respects the "busy" reserved space when calculating overflow', () => {
    setParentWidth(120);
    setItemSizes([40, 40, 40, 40]); // sum without "more" = 120

    const { result } = renderHook(() =>
      useHideOverflowItems({ length: 4, moreIndex: 3, busy: 10 })
    );

    expect(result.current.visibleMap).toEqual([true, false, false, true]);
  });

  it('keeps the pinned index visible even when overflowing', () => {
    setParentWidth(60);
    setItemSizes([30, 30, 30, 30]); // sum without "more" = 90

    const { result } = renderHook(() =>
      useHideOverflowItems({ length: 4, moreIndex: 3, pinnedIndex: 0 })
    );

    expect(result.current.visibleMap[0]).toBe(true);
    expect(result.current.visibleMap[3]).toBe(true); // "more"
    expect(result.current.visibleMap).toEqual([true, false, false, true]);
  });

  it('can hide multiple items symmetrically around "more"', () => {
    setParentWidth(70);
    setItemSizes([25, 25, 25, 25, 25]); // length = 5

    const { result } = renderHook(
      () => useHideOverflowItems({ length: 5 }) // moreIndex defaults to 4
    );

    expect(result.current.visibleMap).toEqual([
      true,
      false,
      false,
      false,
      true,
    ]);
  });

  it('returns an empty map and refs when length = 0', () => {
    setParentWidth(100);
    setItemSizes([]);

    const { result } = renderHook(() => useHideOverflowItems({ length: 0 }));

    expect(result.current.visibleMap).toEqual([]);
    expect(result.current.itemsRefs.length).toBe(0);
  });
});
