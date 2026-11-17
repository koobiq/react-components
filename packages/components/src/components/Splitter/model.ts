import type { SplitterPropOrientation, SplitterPropSize } from './types';
import {
  collapseSplitterSizes,
  EPSILON,
  fitSplitterSizes,
  keepSplitterRestoreSizes,
  resizeSplitterSizesAt,
  resolveSplitterSize,
  snapSplitterSize,
  sumOf,
} from './utils';
import type { SplitterViewport } from './utils';

/** What the splitter reads from a panel's props. */
export type SplitterPanelConfig = {
  size?: SplitterPropSize;
  minSize?: SplitterPropSize;
  maxSize?: SplitterPropSize;
  snapSizes: readonly SplitterPropSize[];
  snapTolerance: number;
  isCollapsible: boolean;
  collapsedSize: SplitterPropSize;
};

export type SplitterModelInput = {
  panels: readonly SplitterPanelConfig[];
  collapsed: readonly boolean[];
  /** Panel sizes as percentages; `null` derives them from the panels. */
  layout: readonly number[] | null;
  /** Splitter size along the resize axis, in pixels; `0` until measured. */
  total: number;
  viewport: SplitterViewport;
};

export type SplitterSeparatorValues = { now: number; min: number; max: number };

export type SplitterModel = ReturnType<typeof createSplitterModel>;

/** Everything the splitter derives from its panels, state and size. */
export function createSplitterModel(input: SplitterModelInput) {
  const { panels, collapsed, layout, total, viewport } = input;

  const resolve = (
    size: SplitterPropSize | null | undefined,
    against = total
  ) => resolveSplitterSize(size, against, viewport);

  const expandedMinSizes = panels.map((panel) =>
    Math.max(0, resolve(panel.minSize) ?? 0)
  );

  // A maximum below the minimum would make every clamp order-dependent.
  const expandedMaxSizes = panels.map((panel, index) =>
    Math.max(
      expandedMinSizes[index] ?? 0,
      resolve(panel.maxSize) ?? Number.POSITIVE_INFINITY
    )
  );

  const collapsedSizes = panels.map((panel) =>
    Math.max(0, resolve(panel.collapsedSize) ?? 0)
  );

  // A collapsed panel is pinned to its strip, which keeps a drag out of the gap
  // between the strip and the minimum.
  const minSizes = panels.map((_, index) =>
    collapsed[index]
      ? (collapsedSizes[index] ?? 0)
      : (expandedMinSizes[index] ?? 0)
  );

  const maxSizes = panels.map((_, index) =>
    collapsed[index]
      ? (collapsedSizes[index] ?? 0)
      : (expandedMaxSizes[index] ?? Number.POSITIVE_INFINITY)
  );

  /** Pulls the boundary after `index` onto the nearest snap point of either panel around it. */
  const snapDelta = (
    index: number,
    delta: number,
    sizes: readonly number[],
    against = total
  ): number => {
    const leading = panels[index];
    const trailing = panels[index + 1];

    if (!leading) return delta;
    if (!leading.snapSizes.length && !trailing?.snapSizes.length) return delta;

    const leadingSize = sizes[index] ?? 0;
    // A trailing size is a position of the same boundary, so it is mapped onto the leading panel.
    const pairSize = leadingSize + (sizes[index + 1] ?? 0);

    const snapPointsOf = (
      panel: SplitterPanelConfig,
      toLeadingSize: (size: number) => number
    ) =>
      [...panel.snapSizes, panel.minSize, panel.maxSize]
        .map((size) => resolve(size, against))
        .filter((size): size is number => size !== null)
        .map((size) => ({
          size: toLeadingSize(size),
          tolerance: panel.snapTolerance,
        }));

    const target = snapSplitterSize(leadingSize + delta, [
      ...snapPointsOf(leading, (size) => size),
      ...(trailing ? snapPointsOf(trailing, (size) => pairSize - size) : []),
    ]);

    return target - leadingSize;
  };

  /** Settles seeded sizes onto the snap points, boundary by boundary, as a release would. */
  const settleOnSnapPoints = (sizes: number[]): number[] =>
    sizes.reduce((settled, _, index) => {
      if (index >= settled.length - 1) return settled;

      const delta = snapDelta(index, 0, settled);

      return Math.abs(delta) < EPSILON
        ? settled
        : resizeSplitterSizesAt(settled, index, delta, minSizes, maxSizes);
    }, sizes);

  const getDefaultSizes = (): number[] => {
    if (!panels.length || total <= 0) return panels.map(() => 0);

    const declared = panels.map((panel, index) =>
      collapsed[index]
        ? (resolve(panel.collapsedSize) ?? 0)
        : resolve(panel.size)
    );

    const flexible = declared.filter((size) => size === null).length;

    const claimed = declared.reduce<number>(
      (sum, size) => sum + (size ?? 0),
      0
    );

    const share = flexible ? Math.max(0, total - claimed) / flexible : 0;

    return settleOnSnapPoints(
      fitSplitterSizes(
        declared.map((size) => size ?? share),
        minSizes,
        maxSizes,
        total
      )
    );
  };

  const getSizes = (): number[] => {
    if (!layout || layout.length !== panels.length || total <= 0) {
      return getDefaultSizes();
    }

    return fitSplitterSizes(
      collapseSplitterSizes(
        layout.map((share) => (share / 100) * total),
        collapsed,
        collapsedSizes
      ),
      minSizes,
      maxSizes,
      total
    );
  };

  const sizes = getSizes();

  /**
   * Room on each side of the boundary after `index`. Measured against the
   * expanded limits: a collapsed panel can still be dragged back out.
   */
  const sideRoom = (index: number) => {
    const room = (available: number) => Math.max(0, available);
    const leading = Array.from({ length: index + 1 }, (_, offset) => offset);

    const trailing = Array.from(
      { length: sizes.length - index - 1 },
      (_, offset) => index + 1 + offset
    );

    const sizeOf = (panel: number) => sizes[panel] ?? 0;
    const minOf = (panel: number) => expandedMinSizes[panel] ?? 0;
    const maxOf = (panel: number) => expandedMaxSizes[panel] ?? Infinity;

    const sumOver = (list: number[], take: (panel: number) => number) =>
      sumOf(list.map(take));

    return {
      leadingGrow: sumOver(leading, (panel) =>
        room(maxOf(panel) - sizeOf(panel))
      ),
      leadingShrink: sumOver(leading, (panel) =>
        room(sizeOf(panel) - minOf(panel))
      ),
      trailingGive: sumOver(trailing, (panel) =>
        room(sizeOf(panel) - minOf(panel))
      ),
      trailingTake: sumOver(trailing, (panel) =>
        room(maxOf(panel) - sizeOf(panel))
      ),
    };
  };

  /** How far the boundary after `index` can still travel each way — what the cursor shows. */
  const boundaryRoom = (index: number) => {
    if (index < 0 || index >= sizes.length - 1) return { grow: 0, shrink: 0 };

    const { leadingGrow, leadingShrink, trailingGive, trailingTake } =
      sideRoom(index);

    return {
      grow: Math.min(leadingGrow, trailingGive),
      shrink: Math.min(leadingShrink, trailingTake),
    };
  };

  /**
   * How far the panel at `index` itself can still be resized — what the ARIA
   * range reports. Narrower than the boundary room: moves handed to panels
   * further out leave this panel where it is.
   */
  const panelRoom = (index: number) => {
    if (index < 0 || index >= sizes.length - 1) return { grow: 0, shrink: 0 };

    const { trailingGive, trailingTake } = sideRoom(index);
    const size = sizes[index] ?? 0;

    return {
      grow: Math.max(
        0,
        Math.min((expandedMaxSizes[index] ?? Infinity) - size, trailingGive)
      ),
      shrink: Math.max(
        0,
        Math.min(size - (expandedMinSizes[index] ?? 0), trailingTake)
      ),
    };
  };

  const separatorCursor = (
    index: number,
    options: {
      orientation: SplitterPropOrientation;
      isDisabled: boolean;
      isRtl: boolean;
    }
  ): string => {
    const { orientation, isDisabled, isRtl } = options;

    if (isDisabled) return 'default';

    const horizontal = orientation === 'horizontal';
    const { grow, shrink } = boundaryRoom(index);

    // One-sided cursors point at the room that is left, not at the panel that owns it.
    const growCursor = horizontal
      ? isRtl
        ? 'w-resize'
        : 'e-resize'
      : 's-resize';

    const shrinkCursor = horizontal
      ? isRtl
        ? 'e-resize'
        : 'w-resize'
      : 'n-resize';

    if (grow < EPSILON && shrink < EPSILON) return 'default';
    if (shrink < EPSILON) return growCursor;
    if (grow < EPSILON) return shrinkCursor;

    return horizontal ? 'col-resize' : 'row-resize';
  };

  /** `aria-valuenow` / `aria-valuemin` / `aria-valuemax` as percentages of the splitter. */
  const separatorValues = (index: number): SplitterSeparatorValues => {
    if (total <= 0) return { now: 0, min: 0, max: 100 };

    const { grow, shrink } = panelRoom(index);
    const size = sizes[index] ?? 0;
    const toPercent = (value: number) => Math.round((value / total) * 100);

    return {
      now: toPercent(size),
      min: toPercent(size - shrink),
      max: toPercent(size + grow),
    };
  };

  /**
   * Turns pixel sizes into a layout. A collapsed panel keeps the share it had
   * before collapsing, unless it is `free` — the one a drag aims at.
   */
  const toLayout = (
    nextSizes: readonly number[],
    free: readonly boolean[] = []
  ): number[] =>
    keepSplitterRestoreSizes(
      nextSizes.map((size) => (size / total) * 100),
      collapsed,
      collapsed.map((isCollapsed, index) =>
        isCollapsed && !free[index] ? layout?.[index] : undefined
      )
    );

  /** Layout that moves the boundary after `index` by `delta` pixels. */
  const resizeBy = (
    index: number,
    delta: number,
    free?: readonly boolean[]
  ): number[] =>
    toLayout(
      resizeSplitterSizesAt(sizes, index, delta, minSizes, maxSizes),
      free
    );

  /**
   * Tracks are percentages of the content box rather than `fr`: CSS Grid
   * would rescale `fr` tracks that cannot add up, breaking the limits the
   * sizes were computed from. Equal tracks stand in until the first
   * measurement.
   */
  const gridTemplate = (): string | undefined => {
    if (!panels.length) return undefined;
    if (total <= 0) return `repeat(${panels.length}, minmax(0, 1fr))`;

    return sizes
      .map((size) => `${((Math.max(0, size) / total) * 100).toFixed(4)}%`)
      .join(' ');
  };

  return {
    total,
    layout,
    collapsed,
    sizes,
    minSizes,
    maxSizes,
    expandedMinSizes,
    expandedMaxSizes,
    snapDelta,
    separatorCursor,
    separatorValues,
    toLayout,
    resizeBy,
    gridTemplate,
  };
}
