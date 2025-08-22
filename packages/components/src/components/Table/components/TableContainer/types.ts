import type { CSSProperties, ReactNode } from 'react';

export type TableContainerPropBlockSize = CSSProperties['blockSize'];

export type TableContainerPropMinBlockSize = CSSProperties['minBlockSize'];

export type TableContainerPropMaxBlockSize = CSSProperties['maxInlineSize'];

export type TableContainerBaseProps = {
  /** Height of the table container. */
  blockSize?: TableContainerPropBlockSize;
  /** Minimum height of the table container. */
  minBlockSize?: TableContainerPropMinBlockSize;
  /** Maximum height of the table container. */
  maxBlockSize?: TableContainerPropMaxBlockSize;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};
