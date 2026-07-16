'use client';

import { forwardRef } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';

import { useResizableHandle } from './hooks';
import s from './Resizable.module.css';
import { useResizableContext } from './ResizableContext';
import type { ResizableHandleProps } from './types';
import { getHandlePositionStyle, isResizableHandleDirection } from './utils';

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

    const state = useResizableContext();

    const { handleProps } = useResizableHandle(
      {
        direction,
        'aria-label': ariaLabelProp,
        tabIndex: tabIndexProp,
      },
      state
    );

    return (
      <div
        {...mergeProps(other, handleProps)}
        ref={ref}
        className={clsx(s.handle, className)}
        style={{ ...styleProp, ...getHandlePositionStyle(direction) }}
      />
    );
  }
);

ResizableHandle.displayName = 'Resizable.Handle';
