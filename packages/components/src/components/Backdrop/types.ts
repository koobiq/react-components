import type { CSSProperties, ReactNode } from 'react';

export type BackdropBaseProps = {
  /** If `true`, the component is shown. */
  open?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the component. */
  children?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
  duration?: number;
  /** z-index. */
  zIndex?: CSSProperties['zIndex'];
  /** Unique identifier for testing purposes. */
  'data-testid'?: string;
};
