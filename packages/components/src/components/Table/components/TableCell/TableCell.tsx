import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { useTableCell } from '@koobiq/react-primitives';
import type { TableState, AriaTableCellProps } from '@koobiq/react-primitives';

import s from './TableCell.module.css';

type TableCellProps<T> = {
  cell: AriaTableCellProps['node'];
  state: TableState<T>;
};

export function TableCell<T>({ cell, state }: TableCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      className={clsx(s.base, isFocusVisible && s.focusVisible)}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
}
