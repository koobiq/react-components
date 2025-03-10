import type { ComponentPropsWithRef } from 'react';

import type { UseCheckboxProps } from '@koobiq/react-primitives';

export const checkboxPropSize = ['normal', 'big'] as const;

export type CheckboxPropSize = (typeof checkboxPropSize)[number];

export const checkboxPropLabelPlacement = ['start', 'end'] as const;

export type CheckboxPropLabelPlacement =
  (typeof checkboxPropLabelPlacement)[number];

export type CheckboxProps = UseCheckboxProps & {
  /** Additional CSS-classes. */
  className?: string;
  /**
   * Size.
   * @default normal
   * */
  size?: CheckboxPropSize;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /**
   * The position of the label.
   * @default end
   * */
  labelPlacement?: CheckboxPropLabelPlacement;
  /** The props used for each slot inside. */
  slotProps?: {
    box?: ComponentPropsWithRef<'span'>;
    label?: ComponentPropsWithRef<'span'>;
  };
};
