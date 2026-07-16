'use client';

import {
  mergeProps,
  useFocusRing,
  useLocalizedStringFormatter,
  useMove,
} from '@koobiq/react-core';

import intlMessages from '../intl.json';
import type { ResizableHandleProps } from '../types';
import { getDirectionKey } from '../utils';

import type { ResizableContextValue } from './useResizable';

const UNBOUNDED_ARIA_MAX = Number.MAX_SAFE_INTEGER;

export type UseResizableHandleProps = Pick<
  ResizableHandleProps,
  'direction' | 'aria-label' | 'tabIndex'
>;

/** Provides interaction and accessibility props for a resize handle. */
export const useResizableHandle = (
  props: UseResizableHandleProps,
  state: ResizableContextValue
) => {
  const { direction, 'aria-label': ariaLabel, tabIndex: tabIndexProp } = props;

  const {
    rootId,
    size,
    bounds,
    isDisabled,
    activeDirection,
    onMoveStart,
    onMove,
    onMoveEnd,
  } = state;

  const t = useLocalizedStringFormatter(intlMessages);
  const [x, y] = direction;
  const isWidthHandle = y === 0;
  const isHeightHandle = x === 0;
  const isCornerHandle = x !== 0 && y !== 0;
  const isResizing = activeDirection === getDirectionKey(direction);

  const { moveProps } = useMove({
    onMoveStart: () => onMoveStart(direction),
    onMove,
    onMoveEnd,
  });

  const { focusProps, isFocusVisible } = useFocusRing({
    isTextInput: false,
    autoFocus: false,
  });

  const defaultLabel = isWidthHandle
    ? t.format('resize width')
    : isHeightHandle
      ? t.format('resize height')
      : t.format('resize');

  const value = isWidthHandle ? size.width : size.height;
  const minValue = isWidthHandle ? bounds.minWidth : bounds.minHeight;
  const maxValue = isWidthHandle ? bounds.maxWidth : bounds.maxHeight;

  const accessibilityProps = {
    role: isCornerHandle ? ('button' as const) : ('separator' as const),
    tabIndex: isDisabled ? -1 : (tabIndexProp ?? 0),
    'aria-label': ariaLabel ?? defaultLabel,
    'aria-controls': rootId,
    'aria-disabled': isDisabled || undefined,
    'aria-keyshortcuts': 'ArrowUp ArrowDown ArrowLeft ArrowRight',
    'aria-orientation': isCornerHandle
      ? undefined
      : isWidthHandle
        ? ('vertical' as const)
        : ('horizontal' as const),
    'aria-valuenow': isCornerHandle ? undefined : Math.round(value),
    'aria-valuemin': isCornerHandle ? undefined : Math.round(minValue),
    'aria-valuemax': isCornerHandle
      ? undefined
      : Math.round(Number.isFinite(maxValue) ? maxValue : UNBOUNDED_ARIA_MAX),
    'aria-valuetext': isCornerHandle ? undefined : `${Math.round(value)} px`,
    'data-direction-x': x,
    'data-direction-y': y,
    'data-focus-visible': isFocusVisible || undefined,
    'data-resizing': isResizing || undefined,
    'data-disabled': isDisabled || undefined,
  };

  return {
    handleProps: isDisabled
      ? accessibilityProps
      : mergeProps(moveProps, focusProps, accessibilityProps),
  };
};
