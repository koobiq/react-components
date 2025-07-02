import type { CSSProperties, ReactNode } from 'react';

type BackdropDeprecatedProps = {
  /**
   * If `true`, the component is shown.
   *
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
};

export type BackdropBaseProps = {
  /** If `true`, the component is shown. */
  isOpen?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the component. */
  children?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
  /** The duration of the transition, in milliseconds. */
  duration?: number;
  /** z-index. */
  zIndex?: CSSProperties['zIndex'];
  /** Unique identifier for testing purposes. */
  'data-testid'?: string;
} & BackdropDeprecatedProps;
