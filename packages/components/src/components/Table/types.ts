import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { TableStateProps } from '@koobiq/react-primitives';
import type { Key } from '@react-types/shared';

export const tablePropDivider = ['none', 'row'] as const;

export type TablePropDivider = (typeof tablePropDivider)[number];

export type TablePropChildren<T> = TableStateProps<T>['children'];

export type TablePropSelectionMode<T> = TableStateProps<T>['selectionMode'];

export type TablePropSelectionBehavior<T> =
  TableStateProps<T>['selectionBehavior'];

export type TablePropOnSelectionChange<T> =
  TableStateProps<T>['onSelectionChange'];

export type TablePropSelectedKeys<T> = TableStateProps<T>['selectedKeys'];

export type TablePropDefaultSelectedKeys<T> =
  TableStateProps<T>['defaultSelectedKeys'];

export type TablePropDisabledBehavior<T> =
  TableStateProps<T>['disabledBehavior'];

export type TablePropDisabledKeys<T> = TableStateProps<T>['disabledKeys'];

export type TablePropBlockSize = CSSProperties['blockSize'];

export type TablePropMinBlockSize = CSSProperties['minBlockSize'];

export type TablePropMaxBlockSize = CSSProperties['maxInlineSize'];

export type TableProps<T> = ExtendableComponentPropsWithRef<
  {
    /** How multiple selection should behave in the collection. */
    selectionBehavior?: TablePropSelectionBehavior<T>;
    /** The type of selection that is allowed in the collection. */
    selectionMode?: TablePropSelectionMode<T>;
    /** The currently selected keys in the collection (controlled). */
    selectedKeys?: TablePropSelectedKeys<T>;
    /** The initial selected keys in the collection (uncontrolled). */
    defaultSelectedKeys?: TablePropDefaultSelectedKeys<T>;
    /** Handler that is called when the selection changes. */
    onSelectionChange?: TablePropOnSelectionChange<T>;
    /** A list of row keys to disable. */
    disabledKeys?: TablePropDisabledKeys<T>;
    /** Whether `disabledKeys` applies to all interactions, or only selection. */
    disabledBehavior?: TablePropDisabledBehavior<T>;
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
  },
  'div'
>;

export type TableComponent = <T extends object>(
  props: TableProps<T>
) => ReactElement | null;

export type TableRef = ComponentRef<'table'>;
