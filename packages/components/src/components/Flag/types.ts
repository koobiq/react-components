import type { CSSProperties, ReactNode } from 'react';

export const flagPropShape = ['rectangle', 'circle'] as const;

export type FlagPropShape = (typeof flagPropShape)[number];

export const flagPropAspectRatio = ['3 / 2', '1 / 1'] as const;

export type FlagPropAspectRatio = (typeof flagPropAspectRatio)[number];

export type FlagBaseProps = {
  /**
   * The corner treatment of the flag. `circle` clips it to a circle (its
   * aspect ratio defaults to `1 / 1`).
   * @default 'rectangle'
   */
  shape?: FlagPropShape;
  /**
   * Hides the inset hairline that separates the flag from the background.
   * @default false
   */
  hideShadow?: boolean;
  /**
   * The size of the flag (its height). A `number` is treated as pixels, a
   * `string` is used as-is (any CSS length). Defaults to `1em`, so the flag
   * tracks the surrounding text.
   */
  size?: number | string;
  /**
   * The box aspect ratio. Common presets are offered, but any CSS
   * `aspect-ratio` value works (e.g. `4 / 3`).
   * @default '3 / 2' (`'1 / 1'` when `shape="circle"`)
   */
  aspectRatio?: FlagPropAspectRatio | CSSProperties['aspectRatio'];
  /** The projected flag graphic (inline `svg` or `img`). */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};
