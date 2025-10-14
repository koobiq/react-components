import { useRef } from 'react';

import { useFocusRing, useHover, mergeProps, clsx } from '@koobiq/react-core';
import {
  useTableColumnResize,
  type AriaTableColumnResizeProps,
  type TableColumnResizeState,
} from '@koobiq/react-primitives';

import s from './Resizer.module.css';

export type ResizerProps<T> = Omit<
  AriaTableColumnResizeProps<T>,
  'aria-label'
> & {
  layoutState: TableColumnResizeState<T>;
};

export function Resizer<T>(props: ResizerProps<T>) {
  const { column, layoutState, onResizeStart, onResize, onResizeEnd } = props;
  const ref = useRef<HTMLInputElement | null>(null);

  const { resizerProps, inputProps, isResizing } = useTableColumnResize(
    {
      column,
      'aria-label': 'Resizer',
      onResizeStart,
      onResize,
      onResizeEnd,
    },
    layoutState,
    ref
  );

  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({});

  return (
    <div
      role="presentation"
      className={clsx(
        s.base,
        isResizing && s.resizing,
        isHovered && s.hovered,
        isFocusVisible && s.focusVisible
      )}
      {...mergeProps(resizerProps, hoverProps)}
    >
      <div className={s.resizer} />
      <input ref={ref} {...mergeProps(inputProps, focusProps)} />
    </div>
  );
}
