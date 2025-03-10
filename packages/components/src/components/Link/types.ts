import type { CSSProperties, ReactNode } from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

import type { TypographyPropVariant } from '../Typography';

export type LinkPropVariant = Extract<
  TypographyPropVariant,
  'text-compact' | 'text-normal' | 'text-big' | 'inherit'
>;

export type LinkBaseProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** The variant of the component. */
  variant?: LinkPropVariant;
  /** Icon placed before the children. */
  startIcon?: ReactNode;
  /** Icon placed after the children. */
  endIcon?: ReactNode;
  /** If `true`, the component is disabled. */
  disabled?: boolean;
  /** If `true`, displays :visited CSS-state. */
  visitable?: boolean;
  /** If `true`, displays the link as a pseudo-link. */
  pseudo?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  onClick?: ButtonOptions['onPress'];
};
