'use client';

import {
  type DOMAttributes,
  mergeProps,
  useFocusRing,
  useHover,
  useLocalizedStringFormatter,
  useMove,
} from '@koobiq/react-core';

import intlMessages from './intl.json';
import type { ResizableHandleDirection } from './types';
import type { ResizableContextValue } from './useResizable';
import { getDirectionKey } from './utils';

type ResizableHandleDOMProps = DOMAttributes<HTMLElement> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type UseResizableHandleProps = {
  direction: ResizableHandleDirection;
  'aria-label'?: string;
  tabIndex?: number;
};

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

  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    isTextInput: false,
    autoFocus: false,
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  let defaultLabel = t.format('resize');

  if (isWidthHandle) {
    defaultLabel = t.format('resize width');
  } else if (isHeightHandle) {
    defaultLabel = t.format('resize height');
  }

  let tabIndex = tabIndexProp ?? 0;

  if (isDisabled) {
    tabIndex = -1;
  }

  const accessibilityProps: ResizableHandleDOMProps = {
    tabIndex,
    'aria-label': ariaLabel ?? defaultLabel,
    'aria-controls': rootId,
    'aria-disabled': isDisabled || undefined,
    'data-direction-x': x,
    'data-direction-y': y,
    'data-hovered': isHovered || undefined,
    'data-focused': isFocused || undefined,
    'data-focus-visible': isFocusVisible || undefined,
    'data-resizing': isResizing || undefined,
    'data-disabled': isDisabled || undefined,
  };

  if (isCornerHandle) {
    accessibilityProps.role = 'button';

    accessibilityProps['aria-keyshortcuts'] =
      'ArrowUp ArrowDown ArrowLeft ArrowRight';
  } else {
    let value = size.height;
    let minValue = bounds.minHeight;
    let maxValue = bounds.maxHeight;
    let orientation: 'horizontal' | 'vertical' = 'horizontal';

    if (isWidthHandle) {
      value = size.width;
      minValue = bounds.minWidth;
      maxValue = bounds.maxWidth;
      orientation = 'vertical';
    }

    let ariaMaxValue = Number.MAX_SAFE_INTEGER;

    if (Number.isFinite(maxValue)) {
      ariaMaxValue = maxValue;
    }

    accessibilityProps.role = 'separator';
    accessibilityProps['aria-orientation'] = orientation;
    accessibilityProps['aria-valuenow'] = Math.round(value);
    accessibilityProps['aria-valuemin'] = Math.round(minValue);
    accessibilityProps['aria-valuemax'] = Math.round(ariaMaxValue);
    accessibilityProps['aria-valuetext'] = `${Math.round(value)} px`;
  }

  let handleProps = accessibilityProps;

  if (!isDisabled) {
    handleProps = mergeProps(
      moveProps,
      hoverProps,
      focusProps,
      accessibilityProps
    );
  }

  return { handleProps };
};
