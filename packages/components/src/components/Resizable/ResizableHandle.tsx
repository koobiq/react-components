'use client';

import { clsx, mergeProps, polymorphicForwardRef } from '@koobiq/react-core';

import { isResizableHandleDirection, useResizableHandle } from './hooks';
import s from './Resizable.module.css';
import { useResizableContext } from './ResizableContext';
import type { ResizableHandleBaseProps } from './types';

/** A draggable handle that changes the size of its parent Resizable. */
export const ResizableHandle = polymorphicForwardRef<
  'div',
  ResizableHandleBaseProps
>((props, ref) => {
  const {
    as: Tag = 'div',
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
    <Tag
      {...mergeProps(other, handleProps)}
      ref={ref}
      className={clsx(s.handle, className)}
      style={styleProp}
    />
  );
});

ResizableHandle.displayName = 'Resizable.Handle';
