import type { DataAttributeProps } from '@koobiq/react-core';

export const formFieldPropLabelPlacement = ['top', 'side'] as const;

export type FormFieldPropLabelPlacement =
  (typeof formFieldPropLabelPlacement)[number];

export const formFieldPropLabelAlign = ['start', 'end'] as const;

export type FormFieldPropLabelAlign = (typeof formFieldPropLabelAlign)[number];

export type FormFieldBaseProps = {
  fullWidth?: boolean;
  className?: string;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: FormFieldPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: FormFieldPropLabelAlign;
} & DataAttributeProps;
