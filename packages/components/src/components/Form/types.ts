import type { ComponentRef } from 'react';

import type { FormProps as FormPropsPrimitive } from '@koobiq/react-primitives';

import type { ResponsiveValue } from '../../utils';
import type {
  FormControlPropLabelAlign,
  FormControlPropLabelPlacement,
} from '../FormControl';

export const formPropLabelInlineSize = [
  '80',
  '128',
  '160',
  '200',
  '240',
  '280',
  '320',
  '360',
  '400',
  '1/4',
  '2/5',
  '1/2',
  'max-content',
] as const;

export type FormPropLabelInlineSize = (typeof formPropLabelInlineSize)[number];

export type FormProps = {
  /**
   * The label's overall position relative to the element it is labeling.
   * Responsive values allowed.
   * @default 'top'
   */
  labelPlacement?:
    | FormControlPropLabelPlacement
    | ResponsiveValue<FormControlPropLabelPlacement>;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * Responsive values allowed.
   * @default 'start'
   */
  labelAlign?:
    | FormControlPropLabelAlign
    | ResponsiveValue<FormControlPropLabelAlign>;
  /**
   * Size of the label column when `labelPlacement="side"`.
   * Ignored for `"top"`.
   *
   * Supports px tokens (`'80'–'400'`), fractions (`'1/4'`, `'2/5'`, `'1/2'`),
   * or `'max-content'`. Responsive values allowed.
   * @default 'max-content'
   */
  labelInlineSize?:
    | FormPropLabelInlineSize
    | ResponsiveValue<FormPropLabelInlineSize>;
} & FormPropsPrimitive;
export type FormRef = ComponentRef<'form'>;
