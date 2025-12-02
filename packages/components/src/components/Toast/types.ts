import type { CSSProperties, ReactElement } from 'react';

export type ToastProviderProps = {
  children?: (state: any) => ReactElement;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};

export type ToastProviderComponent = (
  props: ToastProviderProps
) => ReactElement | null;
