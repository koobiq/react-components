import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';
import type { ProgressBarBaseProps as ProgressBarBasePrimitiveProps } from '@koobiq/react-primitives';

export const progressBarPropVariant = ['indeterminate', 'determinate'] as const;

export type ProgressBarPropVariant = (typeof progressBarPropVariant)[number];

export type ProgressBarBaseProps = ExtendableComponentPropsWithRef<
  {
    children?: never;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /**
     * The variant to use. Use indeterminate or query when there is no progress value.
     * @default 'determinate'
     */
    variant?: ProgressBarPropVariant;
    /** The props used for each slot inside. */
    slotProps?: {
      fill?: ComponentPropsWithRef<'span'>;
    };
  },
  'div'
>;

export type ProgressBarProps = ExtendableProps<
  ProgressBarBaseProps,
  Omit<
    ProgressBarBasePrimitiveProps,
    'children' | 'isIndeterminate' | 'label' | 'formatOptions' | 'valueLabel'
  >
>;
