import type { CSSProperties, ReactNode } from 'react';

export type TableContainerPropBlockSize = CSSProperties['blockSize'];

export type TableContainerPropMinBlockSize = CSSProperties['minBlockSize'];

export type TableContainerPropMaxBlockSize = CSSProperties['maxBlockSize'];

export type TableContainerPropInlineSize = CSSProperties['inlineSize'];

export type TableContainerPropMinInlineSize = CSSProperties['minInlineSize'];

export type TableContainerPropMaxInlineSize = CSSProperties['maxInlineSize'];

export type TableContainerBaseProps = {
  /** Height of the table container. */
  blockSize?: TableContainerPropBlockSize;
  /** Minimum height of the table container. */
  minBlockSize?: TableContainerPropMinBlockSize;
  /** Maximum height of the table container. */
  maxBlockSize?: TableContainerPropMaxBlockSize;
  /** Width of the table container. */
  inlineSize?: TableContainerPropInlineSize;
  /** Minimum width of the table container. */
  minInlineSize?: TableContainerPropMinInlineSize;
  /** Maximum width of the table container. */
  maxInlineSize?: TableContainerPropMaxInlineSize;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};
