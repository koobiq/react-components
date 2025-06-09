import type { ComponentRef, CSSProperties, ReactElement, Ref } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { TableStateProps } from '@koobiq/react-primitives';

export const tablePropDivider = ['none', 'row'] as const;

export type TablePropDivider = (typeof tablePropDivider)[number];

export type TablePropChildren<T> = TableStateProps<T>['children'];

export type TablePropSelectionMode<T> = TableStateProps<T>['selectionMode'];

export type TablePropSelectionBehavior<T> =
  TableStateProps<T>['selectionBehavior'];

export type TablePropBlockSize = CSSProperties['blockSize'];

export type TablePropMinBlockSize = CSSProperties['minBlockSize'];

export type TablePropMaxBlockSize = CSSProperties['maxInlineSize'];

export type TableProps<T> = ExtendableComponentPropsWithRef<
  {
    /** How multiple selection should behave in the collection. */
    selectionBehavior?: TablePropSelectionBehavior<T>;
    /** The type of selection that is allowed in the collection. */
    selectionMode?: TablePropSelectionMode<T>;
    /** Inline styles. */
    style?: CSSProperties;
    /** Additional CSS-classes. */
    className?: string;
    /**
     * Type of separators in the table.
     * @default none
     */
    divider?: TablePropDivider;
    /**
     * If `true`, the table will take up the full width of its container.
     * @default false
     * */
    fullWidth?: boolean;
    /**
     * Flag indicating a fixed table header.
     * @default false
     * */
    stickyHeader?: boolean;
    /**
     * The elements that make up the table.
     * Includes the Table.Header, Table.Body, Table.Column, and Table.Row.
     * */
    children?: TablePropChildren<T>;
    /** Ref to the control. */
    ref?: Ref<HTMLDivElement>;
    /** Height of the table container. */
    blockSize?: TablePropBlockSize;
    /** Minimum height of the table container. */
    minBlockSize?: TablePropMinBlockSize;
    /** Maximum height of the table container. */
    maxBlockSize?: TablePropMaxBlockSize;
  },
  'div'
>;

export type TableComponentProp = <T extends object>(
  props: TableProps<T>
) => ReactElement | null;

export type TableRef = ComponentRef<'table'>;
