import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type { UseToggleProps } from '@koobiq/react-primitives';

export const togglePropSize = ['normal', 'big'] as const;

export type TogglePropSize = (typeof togglePropSize)[number];

export const togglePropLabelPlacement = ['start', 'end'] as const;

export type TogglePropLabelPlacement =
  (typeof togglePropLabelPlacement)[number];

export type ToggleProps = UseToggleProps & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /**
   * Size.
   * @default normal
   * */
  size?: TogglePropSize;
  /**
   * The position of the label.
   * @default end
   * */
  labelPlacement?: TogglePropLabelPlacement;
  /** The props used for each slot inside. */
  slotProps?: {
    track?: ComponentPropsWithRef<'span'>;
    label?: ComponentPropsWithRef<'span'>;
  };
};
