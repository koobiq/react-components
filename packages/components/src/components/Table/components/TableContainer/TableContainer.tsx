'use client';

import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import {
  clsx,
  polymorphicForwardRef,
  useElementSize,
  useMultiRef,
} from '@koobiq/react-core';

import s from './TableContainer.module.css';
import { TableContainerContext } from './TableContainerContext';
import type { TableContainerBaseProps } from './types';
import { normalizeBlockSize } from './utils';

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
  const { ref: tableSizeRef, width: tableInlineSize } = useElementSize();

  const tableRef = useMultiRef([tableSizeRef, ref]);

  const style = {
    ...styleProp,
    '--table-container-block-size': normalizeBlockSize(blockSize),
    '--table-container-min-block-size': normalizeBlockSize(minBlockSize),
    '--table-container-max-block-size': normalizeBlockSize(maxBlockSize),
    '--table-container-scroll-padding-top': `${height}px`,
  } as CSSProperties;

  return (
    <TableContainerContext.Provider value={{ theadRef, tableInlineSize }}>
      <Tag className={clsx(s.base, className)} style={style} ref={tableRef}>
        {children}
      </Tag>
    </TableContainerContext.Provider>
  );
});

TableContainer.displayName = 'TableContainer';

export type TableContainerProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof TableContainer<As>>;
