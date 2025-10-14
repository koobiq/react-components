'use client';

import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { useTableCell } from '@koobiq/react-primitives';
import type { TableState, AriaTableCellProps } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import type { CellProps } from '../../../Collections';

import s from './TableCell.module.css';

type TableCellProps<T> = {
  cell: AriaTableCellProps['node'];
  state: TableState<T>;
};

const textNormal = utilClasses.typography['text-normal'];

export function TableCell<T>({ cell, state }: TableCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  const {
    style,
    className,
    align = 'start',
    valign = 'middle',
    'data-testid': dataTestId,
  }: CellProps = cell.props;

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      className={clsx(
        s.base,
        textNormal,
        align && s[align],
        valign && s[valign],
        isFocusVisible && s.focusVisible,
        className
      )}
      data-align={align || undefined}
      data-valign={valign || undefined}
      data-testid={dataTestId}
      style={style}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
}
