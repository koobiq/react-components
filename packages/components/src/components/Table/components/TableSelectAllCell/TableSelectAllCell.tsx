import { useRef } from 'react';

import {
  useTableColumnHeader,
  VisuallyHidden,
  useTableSelectAllCheckbox,
  type AriaTableColumnHeaderProps,
  type TableState,
} from '@koobiq/react-primitives';

import { Checkbox } from '../../../Checkbox';
import s from '../../Table.module.css';

type TableSelectAllCellProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
};

export function TableSelectAllCell<T>({
  column,
  state,
}: TableSelectAllCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const { checkboxProps } = useTableSelectAllCheckbox(state);

  const { isSelected, isDisabled, isIndeterminate, ...other } = checkboxProps;

  return (
    <th className={s['header-cell']} {...columnHeaderProps} ref={ref}>
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox
          checked={isSelected}
          disabled={isDisabled}
          indeterminate={isIndeterminate}
          {...other}
        />
      )}
    </th>
  );
}
