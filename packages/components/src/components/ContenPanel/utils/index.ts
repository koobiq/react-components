import { isNumber } from '@koobiq/react-core';

import type { ContentPanelSize } from '../types';

export function getInlineSize(el: HTMLElement | null) {
  if (!el) return 0;
  const cs = getComputedStyle(el);
  const mis = parseFloat(cs.marginInlineStart) || 0;
  const mie = parseFloat(cs.marginInlineEnd) || 0;

  return mis + mie + el.getBoundingClientRect().width;
}

export function parseContentPanelSize(
  containerWidth: number | null | undefined,
  value: ContentPanelSize | null | undefined
): number | null {
  if (value == null) return null;

  if (isNumber(value)) {
    return Number.isFinite(value) ? value : null;
  }

  const v = value.trim();

  // %
  if (v.endsWith('%')) {
    if (containerWidth == null || !Number.isFinite(containerWidth)) return null;
    const n = Number(v.slice(0, -1).trim());
    if (!Number.isFinite(n)) return null;

    return containerWidth * (n / 100);
  }

  // px
  if (v.toLowerCase().endsWith('px')) {
    const n = Number(v.slice(0, -2).trim());

    return Number.isFinite(n) ? n : null;
  }

  // "400"
  const n = Number(v);

  return Number.isFinite(n) ? n : null;
}
