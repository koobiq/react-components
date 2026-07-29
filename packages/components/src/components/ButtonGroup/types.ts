import type { CSSProperties, ReactNode } from 'react';

import type { ButtonPropVariant } from '../Button';

export const buttonGroupPropOrientation = ['horizontal', 'vertical'] as const;

export type ButtonGroupPropOrientation =
  (typeof buttonGroupPropOrientation)[number];

export type ButtonGroupBaseProps = {
  /** The content of the component. */
  children?: ReactNode;
  /**
   * The orientation of the group.
   * @default 'horizontal'
   */
  orientation?: ButtonGroupPropOrientation;
  /**
   * The variant applied to every nested button, overriding their own `variant`.
   * @default 'fade-contrast-outline'
   */
  variant?: ButtonPropVariant;
  /** If `true`, every nested button is disabled. */
  isDisabled?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};
