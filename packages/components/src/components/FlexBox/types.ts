import type { CSSProperties, ReactNode } from 'react';

import type { ResponsiveValue } from '../../utils';
import type {
  FlexPropGap,
  FlexPropWrap,
  FlexPropFlex,
  FlexPropDirection,
  FlexPropAlignItems,
  FlexPropJustifyContent,
} from '../layout';

export type FlexBoxBaseProps = {
  /** Defines the `display` property with `flex` or `inline-flex` value. */
  flex?: FlexPropFlex | ResponsiveValue<FlexPropFlex>;
  /** Defines the `flex-wrap` property. */
  wrap?: FlexPropWrap | ResponsiveValue<FlexPropWrap>;
  /** Defines the `flex-direction` property. */
  direction?: FlexPropDirection | ResponsiveValue<FlexPropDirection>;
  /** Defines the `gap` property. */
  gap?: FlexPropGap | ResponsiveValue<FlexPropGap>;
  /** Defines the `column-gap` property. */
  colGap?: FlexPropGap | ResponsiveValue<FlexPropGap>;
  /** Defines the `row-gap` property. */
  rowGap?: FlexPropGap | ResponsiveValue<FlexPropGap>;
  /** Defines the `justify-content` property. */
  justifyContent?:
    | FlexPropJustifyContent
    | ResponsiveValue<FlexPropJustifyContent>;
  /** Defines the `align-items` property. */
  alignItems?: FlexPropAlignItems | ResponsiveValue<FlexPropAlignItems>;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the component. */
  children?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
};
