import type { CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { UseLinkProps } from '@koobiq/react-primitives';

import type { TypographyPropVariant } from '../Typography';

export type LinkPropVariant = Extract<
  TypographyPropVariant,
  'text-compact' | 'text-normal' | 'text-big' | 'inherit'
>;

type LinkBaseDeprecatedProps = {
  /**
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   *
   * If `true`, the component is disabled.
   * */
  disabled?: boolean;
  /**
   * @deprecated
   * The "visitable" prop is deprecated. Use "isVisitable" prop to replace it.
   *
   * If `true`, displays :visited CSS-state.
   * */
  visitable?: boolean;
  /**
   * @deprecated
   * The "pseudo" prop is deprecated. Use "isPseudo" prop to replace it.
   *
   * If `true`, displays the link as a pseudo-link.
   * */
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
    /** If `true`, the component is disabled. */
    isDisabled?: boolean;
    /** If `true`, displays :visited CSS-state. */
    allowVisited?: boolean;
    /** If `true`, displays the link as a pseudo-link. */
    isPseudo?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles */
    style?: CSSProperties;
  } & LinkBaseDeprecatedProps,
  UseLinkProps
>;
