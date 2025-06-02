import { type ReactNode, useRef } from 'react';

import { useTableHeaderRow } from '@koobiq/react-primitives';
import type { TableState, GridRowProps } from '@koobiq/react-primitives';

type TableHeaderRowProps<T> = {
  item: GridRowProps<T>['node'];
  state: TableState<T>;
  children: ReactNode;
};

export function TableHeaderRow<T>({
  item,
  state,
  children,
}: TableHeaderRowProps<T>) {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  );
}
