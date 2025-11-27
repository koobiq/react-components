import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';
import type { ProgressBarBaseProps as ProgressBarBasePrimitiveProps } from '@koobiq/react-primitives';

export const progressBarPropVariant = ['indeterminate', 'determinate'] as const;

export type ProgressBarPropVariant = (typeof progressBarPropVariant)[number];

type ProgressBarDeprecatedProps = {
  /**
   * The variant to use. Use indeterminate or query when there is no progress value.
   * @default 'determinate'
   * @deprecated
   * The "variant" prop is deprecated. Use "isIndeterminate" prop to replace it.
   */
  variant?: ProgressBarPropVariant;
};

export type ProgressBarBaseProps = ExtendableComponentPropsWithRef<
  {
    children?: never;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** The props used for each slot inside. */
    slotProps?: {
      fill?: ComponentPropsWithRef<'span'>;
    };
  },
  'div'
>;

export type ProgressBarProps = ExtendableProps<
  ProgressBarBaseProps & ProgressBarDeprecatedProps,
  Omit<
    ProgressBarBasePrimitiveProps,
    'children' | 'label' | 'formatOptions' | 'valueLabel'
  >
>;
