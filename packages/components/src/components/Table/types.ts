import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { TableStateProps } from '@koobiq/react-primitives';
import type { Key } from '@react-types/shared';

export const tablePropDivider = ['none', 'row'] as const;

export type TablePropDivider = (typeof tablePropDivider)[number];

export type TablePropChildren<T> = TableStateProps<T>['children'];

export type TablePropBlockSize = CSSProperties['blockSize'];

export type TablePropMinBlockSize = CSSProperties['minBlockSize'];

export type TablePropMaxBlockSize = CSSProperties['maxInlineSize'];

export type TableProps<T> = Pick<
  TableStateProps<T>,
  | 'selectionBehavior'
  | 'selectionMode'
  | 'selectedKeys'
  | 'defaultSelectedKeys'
  | 'onSelectionChange'
  | 'disabledKeys'
  | 'disabledBehavior'
> & {
  /** Handler that is called when a user performs an action on the row. */
  onRowAction?: (key: Key) => void;
  /** Handler that is called when a user performs an action on the cell. */
  onCellAction?: (key: Key) => void;
  /** Inline styles. */
  style?: CSSProperties;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * Type of separators in the table.
   * @default 'none'
   */
  divider?: TablePropDivider;
  /**
   * Flag indicating a fixed table header.
   * @default false
   */
  stickyHeader?: boolean;
  /**
   * The elements that make up the table.
   * Includes the Table.Header, Table.Body, Table.Column, and Table.Row.
   */
  children?: TablePropChildren<T>;
  /** Ref to the control. */
  ref?: Ref<HTMLDivElement>;
  /** Height of the table container. */
  blockSize?: TablePropBlockSize;
  /** Minimum height of the table container. */
  minBlockSize?: TablePropMinBlockSize;
  /** Maximum height of the table container. */
  maxBlockSize?: TablePropMaxBlockSize;
  /** The props used for each slot inside. */
  slotProps?: {
    container?: ComponentPropsWithRef<'div'>;
    table?: ComponentPropsWithRef<'table'>;
  };
};

export type TableComponent = <T>(props: TableProps<T>) => ReactElement | null;

export type TableRef = ComponentRef<'table'>;
