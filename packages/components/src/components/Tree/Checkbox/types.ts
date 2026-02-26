import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type { CheckboxProps as AriaCheckboxProps } from 'react-aria-components';

export const checkboxPropSize = ['normal', 'big'] as const;

export type CheckboxPropSize = (typeof checkboxPropSize)[number];

export const checkboxPropLabelPlacement = ['start', 'end'] as const;

export type CheckboxPropLabelPlacement =
  (typeof checkboxPropLabelPlacement)[number];

export type CheckboxPropOnChange = (selected: boolean) => void;

export type CheckboxProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /**
   * Size.
   * @default 'normal'
   */
  size?: CheckboxPropSize;
  /**
   * The position of the label.
   * @default 'end'
   */
  labelPlacement?: CheckboxPropLabelPlacement;
  /** The props used for each slot inside. */
  slotProps?: {
    box?: ComponentPropsWithRef<'span'>;
    label?: ComponentPropsWithRef<'span'>;
  };
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
} & AriaCheckboxProps;
