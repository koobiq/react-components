import type { CSSProperties, ReactNode } from 'react';

import type { ResponsiveValue } from '../../../../utils';

export type GridItemBaseProps = {
  /** The number of columns an item spans. */
  col?: number | ResponsiveValue<number>;
  /** Move an item to a specific column. */
  colStart?: number | ResponsiveValue<number>;
  /** The number of rows an item spans. */
  row?: number | ResponsiveValue<number>;
  /** Move an item to a specific row. */
  rowStart?: number | ResponsiveValue<number>;
  /** The CSS justify-self property sets the way a box is justified inside its alignment container along the appropriate axis. */
  justifySelf?:
    | CSSProperties['justifySelf']
    | ResponsiveValue<CSSProperties['justifySelf']>;
  /** The align-self CSS property overrides a grid or flex item's align-items value. In Grid, it aligns the item inside the grid area. In Flexbox, it aligns the item on the cross axis. */
  alignSelf?:
    | CSSProperties['alignSelf']
    | ResponsiveValue<CSSProperties['alignSelf']>;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the component. */
  children?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
};
