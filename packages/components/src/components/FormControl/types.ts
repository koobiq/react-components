import type { DataAttributeProps } from '@koobiq/react-core';

export const formControlPropLabelPlacement = ['top', 'side'] as const;

export type FormControlPropLabelPlacement =
  (typeof formControlPropLabelPlacement)[number];

export const formControlPropLabelAlign = ['start', 'end'] as const;

export type FormControlPropLabelAlign =
  (typeof formControlPropLabelAlign)[number];

export type FormControlBaseProps = {
  fullWidth?: boolean;
  className?: string;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: FormControlPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: FormControlPropLabelAlign;
} & DataAttributeProps;
