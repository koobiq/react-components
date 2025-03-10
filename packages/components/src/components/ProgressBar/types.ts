import type { ComponentPropsWithRef } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export const progressBarPropVariant = ['indeterminate', 'determinate'] as const;

export type ProgressBarPropVariant = (typeof progressBarPropVariant)[number];

export type ProgressBarBaseProps = {
  children?: never;
  /**
   * The current value (controlled).
   * @default 0
   */
  value?: number;
  /**
   * The smallest value allowed for the input.
   * @default 0
   */
  minValue?: number;
  /**
   * The largest value allowed for the input.
   * @default 100
   */
  maxValue?: number;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * The variant to use. Use indeterminate or query when there is no progress value.
   * @default determinate
   * */
  variant?: ProgressBarPropVariant;
  /** The props used for each slot inside. */
  slotProps?: {
    fill?: ComponentPropsWithRef<'span'>;
  };
};

export type ProgressBarProps = ExtendableComponentPropsWithRef<
  ProgressBarBaseProps,
  'div'
>;
