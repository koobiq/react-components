import type { CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { LinkBaseProps as LinkBasePrimitiveProps } from '@koobiq/react-primitives';

import type { TypographyPropVariant } from '../Typography';

export type LinkPropVariant = Extract<
  TypographyPropVariant,
  'text-compact' | 'text-normal' | 'text-big' | 'inherit'
>;

type LinkDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, displays :visited CSS-state.
   * @deprecated
   * The "visitable" prop is deprecated. Use "isVisitable" prop to replace it.
   */
  visitable?: boolean;
  /**
   * If `true`, displays the link as a pseudo-link.
   * @deprecated
   * The "pseudo" prop is deprecated. Use "isPseudo" prop to replace it.
   */
  pseudo?: boolean;
};

export type LinkBaseProps = ExtendableProps<
  {
    /** The content of the component. */
    children?: ReactNode;
    /** The variant of the component. */
    variant?: LinkPropVariant;
    /** Icon placed before the children. */
    startIcon?: ReactNode;
    /** Icon placed after the children. */
    endIcon?: ReactNode;
    /**
     * If `true`, displays :visited CSS-state.
     */
    allowVisited?: boolean;
    /**
     * If `true`, displays the link as a pseudo-link.
     */
    isPseudo?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles */
    style?: CSSProperties;
  } & LinkDeprecatedProps,
  Omit<LinkBasePrimitiveProps, 'elementType'>
>;
