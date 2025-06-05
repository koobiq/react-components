import { forwardRef, type ReactNode, type Ref } from 'react';

import { clsx } from '@koobiq/react-core';
import { useTableRowGroup } from '@koobiq/react-primitives';

import s from '../../Table.module.css';

export type TableRowGroupProps = {
  children: ReactNode;
  type: 'thead' | 'tbody';
};

export const TableRowGroup = forwardRef(
  ({ type = 'thead', children }: TableRowGroupProps, ref: Ref<any>) => {
    const Element = type;
    const { rowGroupProps } = useTableRowGroup();

    return (
      <Element {...rowGroupProps} ref={ref} className={clsx(s[type])}>
        {children}
      </Element>
    );
  }
);

TableRowGroup.displayName = 'TableRowGroup';
