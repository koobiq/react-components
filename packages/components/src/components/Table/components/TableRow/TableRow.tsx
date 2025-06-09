import { type ReactNode, useRef } from 'react';

import { useFocusRing, mergeProps, useHover, clsx } from '@koobiq/react-core';
import { useTableRow } from '@koobiq/react-primitives';
import type { TableState, GridRowProps } from '@koobiq/react-primitives';

import s from '../../Table.module.css';

type TableRowProps<T> = {
  item: GridRowProps<T>['node'];
  children: ReactNode;
  state: TableState<T>;
};

export function TableRow<T>({ item, children, state }: TableRowProps<T>) {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const isSelected = state.selectionManager.isSelected(item.key);

  const { rowProps, isPressed } = useTableRow(
    {
      node: item,
    },
    state,
    ref
  );

  const { style, className } = item.props;

  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});

  return (
    <tr
      className={clsx(
        s.row,
        isHovered && s.hovered,
        isPressed && s.pressed,
        isSelected && s.selected,
        isFocusVisible && s.focusVisible,
        className
      )}
      data-selected={isSelected}
      data-focus-visible={isFocusVisible}
      {...mergeProps(rowProps, hoverProps, focusProps)}
      style={style}
      ref={ref}
    >
      {children}
    </tr>
  );
}
