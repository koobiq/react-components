import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import { type RadioProps as RadioPropsPrimitive } from '@koobiq/react-primitives';

export const radioPropSize = ['normal', 'big'] as const;

export type RadioPropSize = (typeof radioPropSize)[number];

export const radioPropLabelPlacement = ['start', 'end'] as const;

export type RadioPropLabelPlacement = (typeof radioPropLabelPlacement)[number];

type RadioDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @default false
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
};

export type RadioProps = ExtendableProps<
  {
    /** The content of the component. */
    children?: ReactNode;
    /**
     * Size.
     * @default 'normal'
     */
    size?: RadioPropSize;
    /**
     * The position of the label.
     * @default 'end'
     */
    labelPlacement?: RadioPropLabelPlacement;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      circle?: ComponentPropsWithRef<'span'>;
      label?: ComponentPropsWithRef<'span'>;
    };
  } & RadioDeprecatedProps,
  RadioPropsPrimitive
>;
