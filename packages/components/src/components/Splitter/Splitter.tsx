'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, ReactElement } from 'react';

import {
  clsx,
  useControlledState,
  useIsomorphicEffect,
  useLocale,
  useObjectRef,
} from '@koobiq/react-core';
import type { MoveMoveEvent } from '@koobiq/react-core';

import { createSplitterModel } from './model';
import type {
  SplitterModel,
  SplitterModelInput,
  SplitterPanelConfig,
} from './model';
import s from './Splitter.module.css';
import { SplitterPanelContext } from './SplitterContext';
import { SplitterPanel } from './SplitterPanel';
import type { SplitterBaseProps, SplitterPanelBaseProps } from './types';
import {
  EPSILON,
  isViewportSize,
  keepSplitterRestoreSizes,
  resizeSplitterSizesAt,
} from './utils';
import type { SplitterViewport } from './utils';

/** How far one arrow key press moves a separator, in pixels. */
const KEYBOARD_STEP = 8;

const DEFAULT_SNAP_TOLERANCE = 32;

type PanelElement = ReactElement<SplitterPanelBaseProps>;

const isPanelElement = (node: unknown): node is PanelElement =>
  isValidElement(node) && node.type === SplitterPanel;

/** What a drag measures every move against, so clamping can't drift. */
type DragSnapshot = {
  index: number;
  sizes: number[];
  total: number;
  layout: number[] | null;
  /** Travel of the boundary so far, in pixels towards growing the leading panel. */
  travel: number;
  /** Whether the pointer has travelled at all; a press that never did changes nothing. */
  moved: boolean;
};

const getViewport = (): SplitterViewport =>
  typeof window === 'undefined'
    ? { width: 0, height: 0 }
    : { width: window.innerWidth, height: window.innerHeight };

const toConfig = ({ props }: PanelElement): SplitterPanelConfig => ({
  size: props.size,
  minSize: props.minSize,
  maxSize: props.maxSize,
  snapSizes: props.snapSizes ?? [],
  snapTolerance: props.snapTolerance ?? DEFAULT_SNAP_TOLERANCE,
  isCollapsible: props.isCollapsible ?? false,
  collapsedSize: props.collapsedSize ?? 0,
});

const SplitterComponent = forwardRef<HTMLDivElement, SplitterBaseProps>(
  (props, ref) => {
    const {
      orientation = 'horizontal',
      appearance = 'divider',
      isDisabled = false,
      layout: layoutProp,
      defaultLayout,
      onLayoutChange,
      children,
      className,
      style,
      ...other
    } = props;

    const domRef = useObjectRef(ref);
    const { direction } = useLocale();
    const isRtl = direction === 'rtl';

    const items = Children.toArray(children);
    const panelElements = items.filter(isPanelElement);
    const panels = panelElements.map(toConfig);

    const [layout, setLayout] = useControlledState<number[] | null>(
      layoutProp,
      defaultLayout ?? null,
      onLayoutChange
    );

    // Uncontrolled collapsed state of the panels, by element key.
    const [collapsedByKey, setCollapsedByKey] = useState<
      Record<string, boolean>
    >({});

    // Read once per panel, as `default*` props are.
    const defaultCollapsedRef = useRef<Record<string, boolean>>({});

    const collapsed = panelElements.map(
      ({ key, props: { isCollapsed, defaultCollapsed } }) => {
        const id = String(key);

        defaultCollapsedRef.current[id] ??= defaultCollapsed ?? false;

        return (
          isCollapsed ?? collapsedByKey[id] ?? defaultCollapsedRef.current[id]
        );
      }
    );

    const [total, setTotal] = useState(0);
    const [viewport, setViewport] = useState(getViewport);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const dragRef = useRef<DragSnapshot | null>(null);

    const input: SplitterModelInput = {
      panels,
      collapsed,
      layout,
      total,
      viewport,
    };

    const model = createSplitterModel(input);

    // Pointer moves are rendered asynchronously, so a move can arrive before
    // the previous one is on screen. Handlers read the latest values from here.
    const liveRef = useRef(input);

    useIsomorphicEffect(() => {
      liveRef.current = input;
    });

    const commitLayout = (next: number[] | null) => {
      liveRef.current = { ...liveRef.current, layout: next };
      setLayout(next);
    };

    const setPanelCollapsed = (index: number, value: boolean) => {
      const element = panelElements[index];
      const current = liveRef.current.collapsed;

      if (!element || current[index] === value) return;

      liveRef.current = {
        ...liveRef.current,
        collapsed: current.map((item, i) => (i === index ? value : item)),
      };

      if (element.props.isCollapsed === undefined) {
        setCollapsedByKey((prev) => ({
          ...prev,
          [String(element.key)]: value,
        }));
      }

      element.props.onCollapsedChange?.(value);
    };

    const liveModel = () => createSplitterModel(liveRef.current);

    const commitResize = (
      from: SplitterModel,
      index: number,
      delta: number
    ) => {
      // Unmeasured, every share would divide by zero.
      if (from.total <= 0) return;

      commitLayout(from.resizeBy(index, delta));
    };

    const measure = useCallback(() => {
      const element = domRef.current;

      if (!element) return;

      const computed = window.getComputedStyle(element);

      const padding = (...values: string[]) =>
        values.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

      // The tracks fill the content box, and `client*` is the padding box.
      const size =
        orientation === 'horizontal'
          ? element.clientWidth -
            padding(computed.paddingLeft, computed.paddingRight)
          : element.clientHeight -
            padding(computed.paddingTop, computed.paddingBottom);

      setTotal(Math.max(0, size || 0));
    }, [orientation, domRef]);

    useIsomorphicEffect(() => {
      measure();

      const element = domRef.current;

      if (!element || typeof ResizeObserver === 'undefined') return;

      const observer = new ResizeObserver(() => measure());

      observer.observe(element);

      return () => observer.disconnect();
    }, [measure]);

    const usesViewport = panels.some((panel) =>
      [
        panel.size,
        panel.minSize,
        panel.maxSize,
        panel.collapsedSize,
        ...panel.snapSizes,
      ].some(isViewportSize)
    );

    // The viewport can change while the splitter's own box does not.
    useEffect(() => {
      if (!usesViewport) return;

      const update = () => setViewport(getViewport());

      update();
      window.addEventListener('resize', update);

      return () => window.removeEventListener('resize', update);
    }, [usesViewport]);

    const dragCursor =
      dragIndex === null
        ? null
        : model.separatorCursor(dragIndex, { orientation, isDisabled, isRtl });

    // The pointer leaves the separator once it stops at a limit, so only a
    // document-level cursor keeps the feedback from flickering.
    useEffect(() => {
      if (dragCursor === null) return;

      const { style: bodyStyle } = document.body;
      const previous = bodyStyle.getPropertyValue('cursor');
      const previousPriority = bodyStyle.getPropertyPriority('cursor');

      bodyStyle.setProperty('cursor', dragCursor, 'important');

      return () => {
        if (previous)
          bodyStyle.setProperty('cursor', previous, previousPriority);
        else bodyStyle.removeProperty('cursor');
      };
    }, [dragCursor]);

    const cancelResize = useCallback(() => {
      dragRef.current = null;
      setDragIndex(null);
    }, []);

    // `useMove` keeps reporting a drag that is already under way.
    useEffect(() => {
      if (isDisabled) cancelResize();
    }, [isDisabled, cancelResize]);

    /** Only the two panels around the dragged boundary may cross into their collapse gap. */
    const freePanelsFor = (index: number) =>
      panels.map(
        (panel, i) => panel.isCollapsible && (i === index || i === index + 1)
      );

    const handleResizeStart = (index: number) => {
      const live = liveModel();

      // Without a measurement every size is zero, and a drag would collapse every collapsible panel it touches.
      if (isDisabled || live.total <= 0) return;

      dragRef.current = {
        index,
        sizes: [...live.sizes],
        total: live.total,
        layout: live.layout ? [...live.layout] : null,
        travel: 0,
        moved: false,
      };

      setDragIndex(index);
    };

    const handleResize = (index: number, event: MoveMoveEvent) => {
      const snapshot = dragRef.current;

      if (!snapshot || snapshot.index !== index) return;
      // Panels added or removed mid-drag invalidate every index the snapshot holds.
      if (snapshot.sizes.length !== panels.length) return;

      // In RTL the first panel sits on the right, so growing it moves the boundary west.
      const step =
        orientation === 'vertical'
          ? event.deltaY
          : event.deltaX * (isRtl ? -1 : 1);

      snapshot.travel += step;

      const delta = snapshot.travel;

      if (!snapshot.moved && Math.abs(delta) < EPSILON) return;

      snapshot.moved = true;

      const free = freePanelsFor(index);
      const { expandedMinSizes } = liveModel();

      // Decided by where the pointer went rather than where the panel stopped.
      // Half the minimum is the midpoint of the gap, whichever side the drag came from.
      const aimed: Record<number, number> = {
        [index]: (snapshot.sizes[index] ?? 0) + delta,
        [index + 1]: (snapshot.sizes[index + 1] ?? 0) - delta,
      };

      // Collapsed live, so whatever is bound to `isCollapsed` agrees with the screen for the whole gesture.
      panels.forEach((_, i) => {
        if (!free[i]) return;

        const aimedSize = aimed[i];

        const pin =
          aimedSize !== undefined && aimedSize < (expandedMinSizes[i] ?? 0) / 2;

        setPanelCollapsed(i, pin);
      });

      const next = liveModel();

      if (next.total <= 0) return;

      commitLayout(
        next.toLayout(
          resizeSplitterSizesAt(
            snapshot.sizes,
            index,
            delta,
            next.minSizes,
            next.maxSizes
          ),
          free
        )
      );
    };

    /**
     * Gives a collapsing panel the share it had before the gesture, so
     * expanding it returns to that size rather than to the sliver the drag
     * squeezed it to. Returns whether anything around the boundary collapsed.
     */
    const settleCollapse = (snapshot: DragSnapshot): boolean => {
      const { collapsed: liveCollapsed, layout: liveLayout } = liveRef.current;

      const collapsing = [snapshot.index, snapshot.index + 1].filter(
        (i) => panels[i]?.isCollapsible && liveCollapsed[i]
      );

      if (!collapsing.length) return false;
      if (!liveLayout) return true;

      commitLayout(
        keepSplitterRestoreSizes(
          liveLayout,
          liveCollapsed,
          liveLayout.map((_, i) =>
            collapsing.includes(i)
              ? (snapshot.layout?.[i] ??
                ((snapshot.sizes[i] ?? 0) / snapshot.total) * 100)
              : undefined
          )
        )
      );

      return true;
    };

    const handleResizeEnd = () => {
      const snapshot = dragRef.current;

      dragRef.current = null;
      setDragIndex(null);

      if (
        !snapshot?.moved ||
        snapshot.total <= 0 ||
        snapshot.sizes.length !== panels.length
      ) {
        return;
      }

      if (settleCollapse(snapshot)) return;

      // Snapped on release rather than on every move, the way
      // `scroll-snap-type: proximity` settles: the boundary follows the
      // pointer exactly for the whole drag.
      const live = liveModel();

      const delta = live.snapDelta(
        snapshot.index,
        0,
        live.sizes,
        snapshot.total
      );

      if (Math.abs(delta) < EPSILON) return;

      commitResize(live, snapshot.index, delta);
    };

    const focusPanel = (index: number) => {
      const element = domRef.current;

      if (!element) return;

      const panelNodes = Array.from(element.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          child.dataset.slot === 'splitter-panel'
      );

      panelNodes[index]?.focus();
    };

    const handleSeparatorKeyDown = (
      index: number,
      event: KeyboardEvent<HTMLElement>
    ) => {
      // A modified press belongs to the browser; `Shift` walks the panels backwards on `F6`.
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === 'F6') {
        event.preventDefault();

        // From a separator, "next" is the panel it opens onto and "previous" the one it closes.
        focusPanel(event.shiftKey ? index : index + 1);

        return;
      }

      if (isDisabled) return;

      // A host that declined the last change never re-rendered it.
      liveRef.current = input;

      const horizontal = orientation === 'horizontal';
      const sign = horizontal && isRtl ? -1 : 1;
      const panel = panels[index];
      const live = liveModel();
      const size = live.sizes[index] ?? 0;

      const commit = (action: () => void) => {
        event.preventDefault();
        action();
      };

      const resizeBy = (delta: number) => commitResize(live, index, delta);

      switch (event.key) {
        case 'ArrowLeft':
          if (horizontal) commit(() => resizeBy(-KEYBOARD_STEP * sign));
          break;
        case 'ArrowRight':
          if (horizontal) commit(() => resizeBy(KEYBOARD_STEP * sign));
          break;
        case 'ArrowUp':
          if (!horizontal) commit(() => resizeBy(-KEYBOARD_STEP));
          break;
        case 'ArrowDown':
          if (!horizontal) commit(() => resizeBy(KEYBOARD_STEP));
          break;
        case 'Home':
          commit(() => {
            const min = live.expandedMinSizes[index] ?? 0;

            // A panel already at its minimum has nowhere left to go but away, when it may collapse.
            if (panel?.isCollapsible && size <= min + EPSILON) {
              setPanelCollapsed(index, true);

              return;
            }

            resizeBy(min - size);
          });

          break;
        case 'End':
          commit(() => {
            // Expand first, so the panel grows from its real size rather than its strip.
            if (panel?.isCollapsible) setPanelCollapsed(index, false);

            const expanded = liveModel();

            // The trailing panels bound the move, so the splitter's size stands in for an unbounded maximum.
            const max = Math.min(
              expanded.expandedMaxSizes[index] ?? Infinity,
              expanded.total
            );

            commitResize(expanded, index, max - (expanded.sizes[index] ?? 0));
          });

          break;
        case 'Enter':
          if (panel?.isCollapsible) {
            commit(() =>
              setPanelCollapsed(index, !liveRef.current.collapsed[index])
            );
          }

          break;
        default:
          break;
      }
    };

    const handleSeparatorDoubleClick = (index: number) => {
      if (isDisabled) return;

      liveRef.current = input;

      // First return to the declared sizes; from there, take the panel to its minimum.
      if (input.layout !== null) {
        commitLayout(null);

        return;
      }

      commitResize(
        model,
        index,
        (model.minSizes[index] ?? 0) - (model.sizes[index] ?? 0)
      );
    };

    const gridTemplate = model.gridTemplate();

    let panelIndex = -1;

    const content = items.map((child) => {
      if (!isPanelElement(child)) return child;

      panelIndex += 1;

      const index = panelIndex;

      return (
        <SplitterPanelContext.Provider
          key={child.key}
          value={{
            index,
            isLast: index === panels.length - 1,
            isCollapsed: collapsed[index] ?? false,
            isDisabled,
            isResizing: dragIndex === index,
            orientation,
            separatorCursor: model.separatorCursor(index, {
              orientation,
              isDisabled,
              isRtl,
            }),
            separatorValues: model.separatorValues(index),
            onResizeStart: () => handleResizeStart(index),
            onResize: (event) => handleResize(index, event),
            onResizeEnd: handleResizeEnd,
            onResizeCancel: cancelResize,
            onSeparatorKeyDown: (event) => handleSeparatorKeyDown(index, event),
            onSeparatorDoubleClick: () => handleSeparatorDoubleClick(index),
          }}
        >
          {child}
        </SplitterPanelContext.Provider>
      );
    });

    return (
      <div
        {...other}
        ref={domRef}
        data-orientation={orientation}
        data-appearance={appearance}
        data-disabled={isDisabled || undefined}
        data-resizing={dragIndex !== null || undefined}
        className={clsx(s.base, className)}
        style={{
          ...style,
          // The tracks are the layout, so they win over a consumer's style.
          ...(orientation === 'horizontal'
            ? { gridTemplateColumns: gridTemplate }
            : { gridTemplateRows: gridTemplate }),
        }}
      >
        {content}
      </div>
    );
  }
);

SplitterComponent.displayName = 'Splitter';

/** Splits an area into panels the user can resize by dragging the separators between them. */
export const Splitter = Object.assign(SplitterComponent, {
  Panel: SplitterPanel,
});

export type SplitterProps = ComponentPropsWithRef<typeof Splitter>;

export type SplitterPanelProps = ComponentPropsWithRef<typeof Splitter.Panel>;
