import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';
import type { ProgressBarBaseProps as ProgressBarBasePrimitiveProps } from '@koobiq/react-primitives';

export const progressSpinnerPropSize = ['compact', 'big'] as const;

export type ProgressSpinnerPropSize = (typeof progressSpinnerPropSize)[number];

export const progressSpinnerPropVariant = [
  'indeterminate',
  'determinate',
] as const;

export type ProgressSpinnerPropVariant =
  (typeof progressSpinnerPropVariant)[number];

export type ProgressSpinnerBaseProps = ExtendableComponentPropsWithRef<
  {
    children?: never;
    /**
     * Size.
     * @default 'compact'
     */
    size?: ProgressSpinnerPropSize;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /**
     * The variant to use. Use indeterminate or query when there is no progress value.
     * @default 'determinate'
     */
    variant?: ProgressSpinnerPropVariant;
    /** The props used for each slot inside. */
    slotProps?: {
      spin?: ComponentPropsWithRef<'svg'>;
    };
  },
  'div'
>;

export type ProgressSpinnerProps = ExtendableProps<
  ProgressSpinnerBaseProps,
  Omit<
    ProgressBarBasePrimitiveProps,
    'children' | 'isIndeterminate' | 'label' | 'formatOptions' | 'valueLabel'
  >
>;
