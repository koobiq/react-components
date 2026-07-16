'use client';

import type { CSSProperties } from 'react';
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  clsx,
  mergeRefs,
  useControlledState,
  useElementSize,
} from '@koobiq/react-core';

import s from './Resizable.module.css';
import { ResizableContext, type ResizableMoveEvent } from './ResizableContext';
import { ResizableHandle } from './ResizableHandle';
import type {
  ResizableHandleDirection,
  ResizableProps,
  ResizableSize,
} from './types';
import {
  clampResizableSize,
  getDirectionKey,
  getResizableBounds,
  normalizeResizableSize,
} from './utils';

const ResizableComponent = forwardRef<HTMLDivElement, ResizableProps>(
  (props, forwardedRef) => {
    const {
      size: sizeProp,
      defaultSize: defaultSizeProp,
      minSize,
      maxSize,
      isDisabled = false,
      onResize,
      onResizeStart,
      onResizeEnd,
      id: idProp,
      className,
      style: styleProp,
      children,
      ...other
    } = props;

    const generatedId = useId();
    const rootId = idProp ?? generatedId;

    const {
      ref: elementRef,
      width,
      height,
    } = useElementSize<HTMLDivElement>({ box: 'border-box' });

    const bounds = useMemo(
      () => getResizableBounds(minSize, maxSize),
      [minSize?.width, minSize?.height, maxSize?.width, maxSize?.height]
    );

    const controlledSize = useMemo(
      () => normalizeResizableSize(sizeProp, bounds),
      [sizeProp?.width, sizeProp?.height, bounds]
    );

    const defaultSize = useMemo(
      () => normalizeResizableSize(defaultSizeProp, bounds),
      [defaultSizeProp?.width, defaultSizeProp?.height, bounds]
    );

    const [managedSize, setManagedSize] = useControlledState<
      ResizableSize | null,
      ResizableSize
    >(controlledSize, defaultSize ?? null, onResize);

    const observedSize = clampResizableSize({ width, height }, bounds);
    const currentSize = managedSize ?? observedSize;

    const startSizeRef = useRef(currentSize);
    const lastSizeRef = useRef(currentSize);
    const accumulatedRef = useRef({ x: 0, y: 0 });
    const directionRef = useRef<ResizableHandleDirection>([1, 1]);
    const [activeDirection, setActiveDirection] = useState<string | null>(null);

    const handleMoveStart = useCallback(
      (direction: ResizableHandleDirection) => {
        const rect = elementRef.current?.getBoundingClientRect();

        const startSize = clampResizableSize(
          rect ? { width: rect.width, height: rect.height } : currentSize,
          bounds
        );

        startSizeRef.current = startSize;
        lastSizeRef.current = startSize;
        accumulatedRef.current = { x: 0, y: 0 };
        directionRef.current = direction;
        setActiveDirection(getDirectionKey(direction));
        onResizeStart?.(startSize);
      },
      [bounds, currentSize, elementRef, onResizeStart]
    );

    const handleMove = useCallback(
      (event: ResizableMoveEvent) => {
        const multiplier =
          event.pointerType === 'keyboard' && event.shiftKey ? 10 : 1;

        accumulatedRef.current.x += event.deltaX * multiplier;
        accumulatedRef.current.y += event.deltaY * multiplier;

        const [x, y] = directionRef.current;
        const startSize = startSizeRef.current;

        const nextSize = clampResizableSize(
          {
            width:
              x === 0
                ? startSize.width
                : startSize.width + accumulatedRef.current.x * x,
            height:
              y === 0
                ? startSize.height
                : startSize.height + accumulatedRef.current.y * y,
          },
          bounds
        );

        lastSizeRef.current = nextSize;
        setManagedSize(nextSize);
      },
      [bounds, setManagedSize]
    );

    const handleMoveEnd = useCallback(() => {
      setActiveDirection(null);
      onResizeEnd?.(lastSizeRef.current);
    }, [onResizeEnd]);

    const contextValue = useMemo(
      () => ({
        rootId,
        size: currentSize,
        bounds,
        isDisabled,
        activeDirection,
        onMoveStart: handleMoveStart,
        onMove: handleMove,
        onMoveEnd: handleMoveEnd,
      }),
      [
        rootId,
        currentSize,
        bounds,
        isDisabled,
        activeDirection,
        handleMoveStart,
        handleMove,
        handleMoveEnd,
      ]
    );

    const style = {
      ...styleProp,
      ...(minSize?.width !== undefined && { minWidth: bounds.minWidth }),
      ...(minSize?.height !== undefined && { minHeight: bounds.minHeight }),
      ...(Number.isFinite(bounds.maxWidth) && { maxWidth: bounds.maxWidth }),
      ...(Number.isFinite(bounds.maxHeight) && { maxHeight: bounds.maxHeight }),
      ...(managedSize && {
        width: managedSize.width,
        height: managedSize.height,
      }),
    } satisfies CSSProperties;

    return (
      <ResizableContext.Provider value={contextValue}>
        <div
          {...other}
          ref={mergeRefs(elementRef, forwardedRef)}
          id={rootId}
          className={clsx(s.base, className)}
          style={style}
          data-resizing={activeDirection ? true : undefined}
          data-disabled={isDisabled || undefined}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    );
  }
);

ResizableComponent.displayName = 'Resizable';

type CompoundedComponent = typeof ResizableComponent & {
  Handle: typeof ResizableHandle;
};

/** An element whose width and height can be changed with composed handles. */
export const Resizable = ResizableComponent as CompoundedComponent;

Resizable.Handle = ResizableHandle;
