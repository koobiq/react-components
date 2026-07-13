import type { CSSProperties, ReactNode } from 'react';

export const flagPropShape = ['rectangle', 'square', 'circle'] as const;

export type FlagPropShape = (typeof flagPropShape)[number];

export type FlagBaseProps = {
  /**
   * The shape of the flag.
   * `square` and `circle` expect a 1:1 source; `circle` additionally clips to a circle.
   */
  shape?: FlagPropShape;
  /** Hides the inset hairline that separates the flag from the background. */
  hideShadow?: boolean;
  /**
   * The size of the flag (its height). A `number` is treated as pixels, a
   * `string` is used as-is (any CSS length). Defaults to `1em`, so the flag
   * tracks the surrounding text.
   */
  size?: number | string;
  /** The projected flag graphic (inline `svg` or `img`). */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};
