import type { ReactNode } from 'react';

export const flagPropShape = ['rectangle', 'square', 'circle'] as const;

export type FlagPropShape = (typeof flagPropShape)[number];

export const flagPropShadow = ['inset', 'none'] as const;

export type FlagPropShadow = (typeof flagPropShadow)[number];

export type FlagBaseProps = {
  /**
   * The shape of the flag.
   * `square` and `circle` expect a 1:1 source; `circle` additionally clips to a circle.
   */
  shape?: FlagPropShape;
  /** The inset hairline that separates the flag from the background. */
  shadow?: FlagPropShadow;
  /** Renders a neutral placeholder (unknown or invalid country). */
  empty?: boolean;
  /** Hides the flag from assistive technology (use when adjacent text already names it). */
  decorative?: boolean;
  /** The accessible name (use when the flag has meaning and no adjacent text). */
  label?: string;
  /** The projected flag graphic (inline `svg` or `img`). */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
};
