import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

import type { AsProps } from '@koobiq/react-core';

import type {
  ResizableHandleDirection,
  ResizableSize,
  ResizableSizeConstraints,
} from './hooks';

export { resizableHandleDirections } from './hooks';
export type {
  ResizableHandleDirection,
  ResizableSize,
  ResizableSizeConstraints,
} from './hooks';

export type ResizableBaseProps = {
  /** The controlled size of the element, in CSS pixels. */
  size?: ResizableSize;
  /** The initial size of the element when uncontrolled, in CSS pixels. */
  defaultSize?: ResizableSize;
  /** The minimum allowed size. Omitted dimensions default to zero. */
  minSize?: ResizableSizeConstraints;
  /** The maximum allowed size. Omitted dimensions have no upper limit. */
  maxSize?: ResizableSizeConstraints;
  /** Whether resizing is disabled. */
  isDisabled?: boolean;
  /** Handler called whenever the size changes. */
  onResize?: (size: ResizableSize) => void;
  /** Handler called when a resize interaction starts. */
  onResizeStart?: (size: ResizableSize) => void;
  /** Handler called when a resize interaction ends. */
  onResizeEnd?: (size: ResizableSize) => void;
  /** The id of the resizable target. */
  id?: string;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The content of the component. */
  children?: ReactNode;
};

export type ResizableProps<As extends ElementType = 'div'> = AsProps<
  As,
  ResizableBaseProps,
  ComponentPropsWithRef<As>
>;

export type ResizableHandleBaseProps = {
  /**
   * Physical resize direction: `-1` means left/up, `0` disables the axis,
   * and `1` means right/down.
   */
  direction: ResizableHandleDirection;
  /** The accessible name of the handle. */
  'aria-label'?: string;
  /** Overrides the handle's position in the tab order. */
  tabIndex?: number;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The content of the handle. */
  children?: ReactNode;
};

export type ResizableHandleProps<As extends ElementType = 'div'> = AsProps<
  As,
  ResizableHandleBaseProps,
  ComponentPropsWithRef<As>
>;
