import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type { UseRadioProps } from '@koobiq/react-primitives';

export const radioPropSize = ['normal', 'big'] as const;

export type RadioPropSize = (typeof radioPropSize)[number];

export const radioPropLabelPlacement = ['start', 'end'] as const;

export type RadioPropLabelPlacement = (typeof radioPropLabelPlacement)[number];

export type RadioProps = UseRadioProps & {
  /**
   * Size.
   * @default normal
   * */
  size?: RadioPropSize;
  /**
   * The position of the label.
   * @default end
   */
  labelPlacement?: RadioPropLabelPlacement;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The props used for each slot inside. */
  slotProps?: {
    circle?: ComponentPropsWithRef<'span'>;
    label?: ComponentPropsWithRef<'span'>;
  };
};
