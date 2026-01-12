import type { CSSProperties, ReactNode } from 'react';

import type { AriaDisclosureProps } from '@koobiq/react-primitives';

export type DisclosureProps = AriaDisclosureProps & {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};
