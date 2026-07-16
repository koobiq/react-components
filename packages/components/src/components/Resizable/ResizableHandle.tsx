'use client';

import { forwardRef } from 'react';

import {
  clsx,
  mergeProps,
  useFocusRing,
  useLocalizedStringFormatter,
  useMove,
} from '@koobiq/react-core';

import intlMessages from './intl.json';
import s from './Resizable.module.css';
import { useResizableContext } from './ResizableContext';
import type { ResizableHandleProps } from './types';
import {
  getDirectionKey,
  getHandlePositionStyle,
  isResizableHandleDirection,
} from './utils';

const UNBOUNDED_ARIA_MAX = Number.MAX_SAFE_INTEGER;

/** A draggable handle that changes the size of its parent Resizable. */
export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  (props, ref) => {
    const {
      direction,
      className,
      style: styleProp,
      tabIndex: tabIndexProp,
      'aria-label': ariaLabelProp,
      ...other
    } = props;

    if (!isResizableHandleDirection(direction)) {
      throw new Error(
        'Resizable.Handle direction must be one of the eight non-zero [x, y] directions.'
      );
    }

    const {
      rootId,
      size,
      bounds,
      isDisabled,
      activeDirection,
      onMoveStart,
      onMove,
      onMoveEnd,
    } = useResizableContext();

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

    const interactionProps = isDisabled
      ? other
      : mergeProps(moveProps, focusProps, other);

    const defaultLabel = isWidthHandle
      ? t.format('resize width')
      : isHeightHandle
        ? t.format('resize height')
        : t.format('resize');

    const value = isWidthHandle ? size.width : size.height;
    const minValue = isWidthHandle ? bounds.minWidth : bounds.minHeight;
    const maxValue = isWidthHandle ? bounds.maxWidth : bounds.maxHeight;

    return (
      <div
        {...interactionProps}
        ref={ref}
        className={clsx(s.handle, className)}
        style={{ ...styleProp, ...getHandlePositionStyle(direction) }}
        role={isCornerHandle ? 'button' : 'separator'}
        tabIndex={isDisabled ? -1 : (tabIndexProp ?? 0)}
        aria-label={ariaLabelProp ?? defaultLabel}
        aria-controls={rootId}
        aria-disabled={isDisabled || undefined}
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
        aria-orientation={
          isCornerHandle ? undefined : isWidthHandle ? 'vertical' : 'horizontal'
        }
        aria-valuenow={isCornerHandle ? undefined : Math.round(value)}
        aria-valuemin={isCornerHandle ? undefined : Math.round(minValue)}
        aria-valuemax={
          isCornerHandle
            ? undefined
            : Math.round(
                Number.isFinite(maxValue) ? maxValue : UNBOUNDED_ARIA_MAX
              )
        }
        aria-valuetext={isCornerHandle ? undefined : `${Math.round(value)} px`}
        data-direction-x={x}
        data-direction-y={y}
        data-focus-visible={isFocusVisible || undefined}
        data-resizing={isResizing || undefined}
        data-disabled={isDisabled || undefined}
      />
    );
  }
);

ResizableHandle.displayName = 'Resizable.Handle';
