'use client';

import { forwardRef, type ReactNode, type Ref } from 'react';

import { useTableRowGroup } from '@koobiq/react-primitives';

export type TableRowGroupProps = {
  children: ReactNode;
  type: 'thead' | 'tbody';
};

export const TableRowGroup = forwardRef(
  ({ type = 'thead', children }: TableRowGroupProps, ref: Ref<any>) => {
    const Element = type;
    const { rowGroupProps } = useTableRowGroup();

    return (
      <Element {...rowGroupProps} ref={ref}>
        {children}
      </Element>
    );
  }
);

TableRowGroup.displayName = 'TableRowGroup';
