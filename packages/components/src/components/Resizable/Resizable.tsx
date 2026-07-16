'use client';

import { forwardRef } from 'react';

import { clsx, mergeRefs } from '@koobiq/react-core';

import { useResizable, useResizableState } from './hooks';
import s from './Resizable.module.css';
import { ResizableContext } from './ResizableContext';
import { ResizableHandle } from './ResizableHandle';
import type { ResizableProps } from './types';

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
      id,
      className,
      style: styleProp,
      children,
      ...other
    } = props;

    const state = useResizableState({
      size: sizeProp,
      defaultSize: defaultSizeProp,
      minSize,
      maxSize,
      isDisabled,
      onResize,
      onResizeStart,
      onResizeEnd,
    });

    const {
      resizableProps: {
        ref: targetRef,
        style: resizableStyle,
        ...behaviorProps
      },
      contextValue,
    } = useResizable<HTMLDivElement>(
      {
        id,
        minSize,
      },
      state
    );

    return (
      <ResizableContext.Provider value={contextValue}>
        <div
          {...other}
          {...behaviorProps}
          ref={mergeRefs(targetRef, forwardedRef)}
          className={clsx(s.base, className)}
          style={{ ...styleProp, ...resizableStyle }}
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
