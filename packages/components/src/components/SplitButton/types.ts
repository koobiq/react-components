import type { CSSProperties, ReactElement } from 'react';

import { buttonGroupPropVariant } from '../ButtonGroup/types.js';

export const splitButtonPropVariant = buttonGroupPropVariant;

export type SplitButtonPropVariant = (typeof splitButtonPropVariant)[number];

export type SplitButtonBaseProps = {
  /**
   * The content of the component. Expects exactly two elements: the primary
   * action `Button`, followed by a `Menu` whose `control` renders the
   * trigger `Button` for the secondary actions.
   */
  children?: [primaryAction: ReactElement, menu: ReactElement];
  /**
   * The variant applied to both nested buttons.
   * @default 'fade-contrast-filled'
   */
  variant?: SplitButtonPropVariant;
  /** If `true`, both nested buttons are disabled. */
  isDisabled?: boolean;
  /** If `true`, both nested buttons show a loader and block clicks. */
  isLoading?: boolean;
  /**
   * If `true`, the menu's width matches the split button's width.
   * @default false
   */
  panelAutoWidth?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};
