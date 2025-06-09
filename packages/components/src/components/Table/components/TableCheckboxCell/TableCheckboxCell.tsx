import { useRef } from 'react';

import {
  type AriaTableCellProps,
  type TableState,
  useTableCell,
  useTableSelectionCheckbox,
} from '@koobiq/react-primitives';

import { Checkbox } from '../../../Checkbox';
import s from '../../Table.module.css';

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

  const { isSelected, isDisabled, isIndeterminate, ...other } = checkboxProps;

  return (
    <td className={s.cell} {...gridCellProps} ref={ref}>
      <Checkbox
        checked={isSelected}
        disabled={isDisabled}
        indeterminate={isIndeterminate}
        {...other}
      />
    </td>
  );
}
