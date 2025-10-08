'use client';

import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';
import { forwardRef } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { useTableRowGroup } from '@koobiq/react-primitives';

export type TableRowGroupProps = {
  children: ReactNode;
  type: 'thead' | 'tbody';
  theadProps?: ComponentPropsWithRef<'thead'>;
  tbodyProps?: ComponentPropsWithRef<'tbody'>;
};

export const TableRowGroup = forwardRef(
  (
    { type = 'thead', children, theadProps, tbodyProps }: TableRowGroupProps,
    ref: Ref<any>
  ) => {
    const Element = type;
    const { rowGroupProps } = useTableRowGroup();

    const elementProps = mergeProps(
      { ...rowGroupProps, ref },
      type === 'thead' ? theadProps : tbodyProps
    );

    return <Element {...elementProps}>{children}</Element>;
  }
);

TableRowGroup.displayName = 'TableRowGroup';
