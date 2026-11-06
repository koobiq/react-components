'use client';

import { useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import {
  clsx,
  useElementSize,
  useIsomorphicEffect,
  polymorphicForwardRef,
  useMultiRef,
} from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';

import s from './TableContainer.module.css';
import { TableContainerContext } from './TableContainerContext';
import type { TableContainerBaseProps } from './types';
import { normalizeBlockSize } from './utils';

const { nativeScrollbar } = utilClasses;

export const TableContainer = polymorphicForwardRef<
  'div',
  TableContainerBaseProps
>((props, ref) => {
  const {
    as: Tag = 'div',
    children,
    className,
    blockSize,
    maxBlockSize,
    minBlockSize,
    style: styleProp,
  } = props;

  const { ref: theadRef, height } = useElementSize();
  const { ref: tableSizeRef, width: observedWidth } = useElementSize();
  const [initialWidth, setInitialWidth] = useState<number>();

  const tableRef = useMultiRef([tableSizeRef, ref]);

  // `ResizeObserver` reports asynchronously and the observed width is `0` until
  // then, which would render the resizable columns with zero width. Measure the
  // container before the first paint instead.
  useIsomorphicEffect(() => {
    const width = tableSizeRef.current?.getBoundingClientRect().width;

    if (width) setInitialWidth(width);
  }, []);

  // `undefined` is reserved for a table rendered outside the container.
  const tableContainerWidth =
    observedWidth > 0 ? observedWidth : (initialWidth ?? 0);

  const style = {
    ...styleProp,
    '--table-container-block-size': normalizeBlockSize(blockSize),
    '--table-container-min-block-size': normalizeBlockSize(minBlockSize),
    '--table-container-max-block-size': normalizeBlockSize(maxBlockSize),
    '--table-container-scroll-padding-top': `${height}px`,
  } as CSSProperties;

  return (
    <TableContainerContext.Provider value={{ theadRef, tableContainerWidth }}>
      <Tag
        className={clsx(s.base, nativeScrollbar, className)}
        style={style}
        ref={tableRef}
      >
        {children}
      </Tag>
    </TableContainerContext.Provider>
  );
});

TableContainer.displayName = 'TableContainer';

export type TableContainerProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof TableContainer<As>>;
