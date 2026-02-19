'use client';

import type { RefObject } from 'react';
import { useMemo } from 'react';

import { useResizeObserverRefs } from '@koobiq/react-core';

/**
 * Returns sum of inline paddings (start + end) in px for a given element ref.
 * Updates on ResizeObserver notifications.
 */
export function useInlinePaddingSize<
  Element extends HTMLElement | SVGGraphicsElement,
>(ref: RefObject<Element | null>) {
  const refs = useMemo(() => [ref], [ref]);

  const [paddingInline] = useResizeObserverRefs<Element, number>(refs, (el) => {
    if (!el) return 0;

    const cs = getComputedStyle(el);

    const start = parseFloat(cs.paddingInlineStart || cs.paddingLeft) || 0;

    const end = parseFloat(cs.paddingInlineEnd || cs.paddingRight) || 0;

    return start + end;
  });

  return paddingInline ?? 0;
}
