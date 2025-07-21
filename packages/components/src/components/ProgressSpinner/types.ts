import type { ComponentPropsWithRef } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export const progressSpinnerPropSize = ['compact', 'big'] as const;

export type ProgressSpinnerPropSize = (typeof progressSpinnerPropSize)[number];

export const progressSpinnerPropVariant = [
  'indeterminate',
  'determinate',
] as const;

export type ProgressSpinnerPropVariant =
  (typeof progressSpinnerPropVariant)[number];

export type ProgressSpinnerBaseProps = {
  children?: never;
  /**
   * The current value (controlled).
   * @default 0
   */
  value?: number;
  /**
   * Size.
   * @default 'compact'
   */
  size?: ProgressSpinnerPropSize;
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
   * @default 'determinate'
   */
  variant?: ProgressSpinnerPropVariant;
  /** The props used for each slot inside. */
  slotProps?: {
    spin?: ComponentPropsWithRef<'svg'>;
  };
};

export type ProgressSpinnerProps = ExtendableComponentPropsWithRef<
  ProgressSpinnerBaseProps,
  'div'
>;
