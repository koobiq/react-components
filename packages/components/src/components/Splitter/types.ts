import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

export const splitterPropOrientation = ['horizontal', 'vertical'] as const;

export type SplitterPropOrientation = (typeof splitterPropOrientation)[number];

export const splitterPropAppearance = [
  'divider',
  'transparent',
  'handle',
] as const;

export type SplitterPropAppearance = (typeof splitterPropAppearance)[number];

/**
 * Size of a panel: a number of pixels, a `<number>px` string, a `<number>%`
 * share of the splitter along the resize axis, or a `<number>vw` /
 * `<number>vh` share of the viewport. A size in any other unit is ignored.
 */
export type SplitterPropSize = number | string;

export type SplitterBaseProps = ExtendableComponentPropsWithRef<
  {
    /**
     * The direction the panels are laid out in.
     * @default 'horizontal'
     */
    orientation?: SplitterPropOrientation;
    /**
     * How the separators are drawn: `divider` — a line between the panels,
     * `transparent` — nothing but the cursor, `handle` — a grip centred on
     * the boundary.
     * @default 'divider'
     */
    appearance?: SplitterPropAppearance;
    /** Whether the panels can't be resized. */
    isDisabled?: boolean;
    /**
     * The sizes of the panels as percentages of the splitter, in panel order
     * (controlled). `null` derives them from the sizes the panels declare.
     */
    layout?: number[] | null;
    /**
     * The initial sizes of the panels as percentages of the splitter
     * (uncontrolled).
     * @default null
     */
    defaultLayout?: number[] | null;
    /**
     * Handler that is called when the user resizes the panels, or with `null`
     * when a double-click returns them to the sizes they declare.
     */
    onLayoutChange?: (layout: number[] | null) => void;
    /**
     * The panels. Only `Splitter.Panel` elements placed directly inside the
     * splitter take part in the layout.
     */
    children?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
  },
  'div'
>;

export type SplitterPanelBaseProps = ExtendableComponentPropsWithRef<
  {
    /**
     * The id of the panel, which its separator points `aria-controls` at.
     * Generated when omitted.
     */
    id?: string;
    /**
     * The size the panel starts at. Panels without a size share whatever the
     * sized ones did not claim.
     */
    size?: SplitterPropSize;
    /**
     * The smallest size the panel can be resized to.
     * @default 0
     */
    minSize?: SplitterPropSize;
    /** The largest size the panel can be resized to. Unbounded when omitted. */
    maxSize?: SplitterPropSize;
    /**
     * Sizes a drag is pulled onto when it is released near one. `minSize` and
     * `maxSize` of both panels around a separator become snap points too.
     */
    snapSizes?: readonly SplitterPropSize[];
    /**
     * How close to one of `snapSizes` a drag has to be released to be pulled
     * in, in pixels.
     * @default 32
     */
    snapTolerance?: number;
    /**
     * Whether dragging the panel past half of its `minSize` collapses it to
     * `collapsedSize` instead of stopping at the minimum.
     */
    isCollapsible?: boolean;
    /**
     * The size the panel takes while collapsed. `0` hides it completely.
     * @default 0
     */
    collapsedSize?: SplitterPropSize;
    /** Whether the panel is collapsed (controlled). */
    isCollapsed?: boolean;
    /**
     * Whether the panel is collapsed by default (uncontrolled).
     * @default false
     */
    defaultCollapsed?: boolean;
    /** Handler that is called when the panel collapses or expands. */
    onCollapsedChange?: (isCollapsed: boolean) => void;
    /** The props used for each slot inside. */
    slotProps?: {
      content?: ComponentPropsWithRef<'div'> & DataAttributeProps;
      separator?: ComponentPropsWithRef<'div'> & DataAttributeProps;
    };
    /** The content of the panel. */
    children?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
  },
  'div'
>;
