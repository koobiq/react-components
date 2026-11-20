import { clamp } from '@koobiq/react-core';

import type { SplitterPropSize } from './types';

/** Sizes closer than this are the same size. */
export const EPSILON = 0.01;

/** A size a drag is pulled onto, with the distance the release has to be within. */
export type SplitterSnapPoint = { size: number; tolerance: number };

export type SplitterViewport = { width: number; height: number };

export const sumOf = (sizes: readonly number[]): number =>
  sizes.reduce((sum, size) => sum + size, 0);

/** A number, bare or followed by `px`, `%`, `vw` or `vh` — the only size strings a panel understands. */
const SPLITTER_SIZE_PATTERN = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(px|%|vw|vh)?$/i;

const VIEWPORT_SIZE_PATTERN = /(vw|vh)$/i;

/** Whether a size depends on the viewport, so the splitter has to follow it. */
export const isViewportSize = (size: SplitterPropSize | undefined): boolean =>
  typeof size === 'string' && VIEWPORT_SIZE_PATTERN.test(size.trim());

/**
 * Resolves a declared size into pixels: `%` against `total`, the splitter's own
 * size along the resize axis, `vw` / `vh` against the viewport.
 *
 * Returns `null` for a size that is not set or is in another unit: reading
 * `10rem` as ten pixels would hand the panel a limit nobody asked for.
 */
export function resolveSplitterSize(
  size: SplitterPropSize | null | undefined,
  total: number,
  viewport: SplitterViewport = { width: 0, height: 0 }
): number | null {
  if (size === null || size === undefined) return null;

  if (typeof size === 'number') return Number.isFinite(size) ? size : null;

  const [, value, unit] = SPLITTER_SIZE_PATTERN.exec(size.trim()) ?? [];

  if (value === undefined) return null;

  const amount = parseFloat(value);

  switch (unit?.toLowerCase()) {
    case '%':
      return (amount / 100) * total;
    case 'vw':
      return (amount / 100) * viewport.width;
    case 'vh':
      return (amount / 100) * viewport.height;
    default:
      return amount;
  }
}

/**
 * Clamps every panel to its limits and spends what that left over, so the
 * sizes add up to `total` again.
 *
 * The residual is handed out in passes: a panel that reaches a limit mid-pass
 * stops taking, and the next pass shares what it refused among the others.
 */
export function fitSplitterSizes(
  sizes: readonly number[],
  min: readonly number[],
  max: readonly number[],
  total: number
): number[] {
  const next = sizes.map((size, index) =>
    clamp(size, min[index] ?? 0, max[index] ?? Infinity)
  );

  for (let pass = 0; pass <= next.length; pass++) {
    const diff = total - sumOf(next);

    if (Math.abs(diff) < EPSILON) break;

    const open = next
      .map((_, index) => index)
      .filter((index) =>
        diff > 0
          ? (next[index] ?? 0) < (max[index] ?? Infinity)
          : (next[index] ?? 0) > (min[index] ?? 0)
      );

    if (!open.length) break;

    const step = diff / open.length;

    open.forEach((index) => {
      next[index] = clamp(
        (next[index] ?? 0) + step,
        min[index] ?? 0,
        max[index] ?? Infinity
      );
    });
  }

  return next;
}

/**
 * Pins every collapsed panel to its strip and shares what that frees among the
 * open panels in equal parts.
 *
 * A collapsed panel's layout entry holds the size it returns to, not the strip
 * it shows — that is what lets expanding restore it.
 */
export function collapseSplitterSizes(
  sizes: readonly number[],
  collapsed: readonly boolean[],
  strips: readonly number[]
): number[] {
  const open = collapsed.filter((isCollapsed) => !isCollapsed).length;

  const freed = sizes.reduce(
    (sum, size, index) =>
      collapsed[index] ? sum + size - (strips[index] ?? 0) : sum,
    0
  );

  return sizes.map((size, index) =>
    collapsed[index] ? (strips[index] ?? 0) : size + (open ? freed / open : 0)
  );
}

/**
 * The inverse of {@link collapseSplitterSizes}: puts each `restore` size back
 * into its collapsed panel's entry and takes what that adds from the open
 * panels in the same equal parts.
 */
export function keepSplitterRestoreSizes(
  sizes: readonly number[],
  collapsed: readonly boolean[],
  restore: readonly (number | undefined)[]
): number[] {
  const open = collapsed.filter((isCollapsed) => !isCollapsed).length;

  const added = restore.reduce<number>(
    (sum, size, index) =>
      size === undefined ? sum : sum + size - (sizes[index] ?? 0),
    0
  );

  return sizes.map(
    (size, index) =>
      restore[index] ??
      (collapsed[index] ? size : size - (open ? added / open : 0))
  );
}

/**
 * Moves the boundary that follows `index` by `delta` pixels.
 *
 * Both sides walk outwards from the boundary: a panel at its limit hands the
 * remainder to the next one, so a pinned neighbour does not freeze a boundary
 * the panels further out could still move.
 */
export function resizeSplitterSizesAt(
  sizes: readonly number[],
  index: number,
  delta: number,
  min: readonly number[],
  max: readonly number[]
): number[] {
  const next = [...sizes];

  if (index < 0 || index >= sizes.length - 1) return next;

  const sizeOf = (panel: number) => sizes[panel] ?? 0;
  const minOf = (panel: number) => min[panel] ?? 0;
  const maxOf = (panel: number) => max[panel] ?? Infinity;

  const roomOf = (panel: number, grow: boolean) =>
    grow ? maxOf(panel) - sizeOf(panel) : sizeOf(panel) - minOf(panel);

  // Nearest to the boundary first.
  const leading = Array.from(
    { length: index + 1 },
    (_, offset) => index - offset
  );

  const trailing = Array.from(
    { length: sizes.length - index - 1 },
    (_, offset) => index + 1 + offset
  );

  const growing = delta > 0;

  const roomOfSide = (panels: number[], grow: boolean) =>
    panels.reduce((room, panel) => room + roomOf(panel, grow), 0);

  // The boundary travels as far as the tighter side allows.
  const travel = Math.min(
    Math.abs(delta),
    roomOfSide(leading, growing),
    roomOfSide(trailing, !growing)
  );

  const spend = (panels: number[], grow: boolean) => {
    let remaining = travel;

    for (const panel of panels) {
      if (remaining <= EPSILON) break;

      const taken = Math.min(remaining, roomOf(panel, grow));

      next[panel] = sizeOf(panel) + (grow ? taken : -taken);
      remaining -= taken;
    }
  };

  spend(leading, growing);
  spend(trailing, !growing);

  return next;
}

/**
 * Snaps a target size onto the nearest snap point within its own tolerance,
 * or returns it unchanged. A tie is settled by declaration order.
 */
export function snapSplitterSize(
  target: number,
  snapPoints: readonly SplitterSnapPoint[]
): number {
  let snapped = target;
  let closest = Number.POSITIVE_INFINITY;

  for (const { size, tolerance } of snapPoints) {
    if (!Number.isFinite(size)) continue;

    const distance = Math.abs(size - target);

    if (distance > tolerance || distance >= closest) continue;

    closest = distance;
    snapped = size;
  }

  return snapped;
}
