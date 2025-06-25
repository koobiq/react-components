'use client';

import { useRef } from 'react';

import {
  type AriaTableCellProps,
  type TableState,
  useTableCell,
  useTableSelectionCheckbox,
} from '@koobiq/react-primitives';

import { Checkbox } from '../../../Checkbox';
import s from '../TableCell/TableCell.module.css';

type TableCheckboxCellProps<T> = {
  cell: AriaTableCellProps['node'];
  state: TableState<T>;
};

export function TableCheckboxCell<T>({
  cell,
  state,
}: TableCheckboxCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);

  const { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey! },
    state
  );

  return (
    <td className={s.base} {...gridCellProps} ref={ref}>
      <Checkbox {...checkboxProps} />
    </td>
  );
}
