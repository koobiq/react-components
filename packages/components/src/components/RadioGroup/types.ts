import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';
import type {
  RadioGroup as RadioGroupPrimitive,
  RadioGroupProps as RadioGroupPrimitiveProps,
} from '@koobiq/react-primitives';

import type { FieldCaptionProps, FieldErrorProps } from '../FieldComponents';
import {
  type FormControlPropLabelAlign,
  formControlPropLabelAlign,
  type FormControlPropLabelPlacement,
  formControlPropLabelPlacement,
  type FormControlProps,
} from '../FormControl';
import type { FormControlLabelProps } from '../FormControlLabel';

export const radioGroupPropSize = ['normal', 'big'] as const;

export type RadioGroupPropSize = (typeof radioGroupPropSize)[number];

export const radioGroupPropOrientation = ['horizontal', 'vertical'] as const;

export type RadioGroupPropOrientation =
  (typeof radioGroupPropOrientation)[number];

export const radioGroupPropLabelPlacement = formControlPropLabelPlacement;
export type RadioGroupPropLabelPlacement = FormControlPropLabelPlacement;
export const radioGroupPropLabelAlign = formControlPropLabelAlign;
export type RadioGroupPropLabelAlign = FormControlPropLabelAlign;

type RadioGroupDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the component will indicate an error.
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * It prevents the user from changing the value of the checkbox.
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadonly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * If `true`, the input element is required.
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
  /**
   * The helper text content.
   * @deprecated
   * The "description" prop is deprecated. Use "caption" prop to replace it.
   */
  description?: ReactNode;
};

export type RadioGroupBaseProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The helper text content. */
    caption?: ReactNode;
    /** Inline styles. */
    style?: CSSProperties;
    /** The content of the component. */
    children?: ReactNode;
    /**
     * Size.
     * @default 'normal'
     */
    size?: RadioGroupPropSize;
    /**
     * The axis the Radio Button(s) should align with.
     * @default 'vertical'
     */
    orientation?: RadioGroupPropOrientation;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     */
    isLabelHidden?: boolean;
    /**
     * The label's overall position relative to the element it is labeling.
     * @default 'top'
     */
    labelPlacement?: RadioGroupPropLabelPlacement;
    /**
     * The label's horizontal alignment relative to the element it is labeling.
     * @default 'start'
     */
    labelAlign?: RadioGroupPropLabelAlign;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FormControlProps<typeof RadioGroupPrimitive>;
      caption?: FieldCaptionProps;
      errorMessage?: FieldErrorProps;
      label?: FormControlLabelProps<'span'>;
      radioGroup?: ComponentPropsWithRef<'div'>;
    };
  } & RadioGroupDeprecatedProps,
  Omit<RadioGroupPrimitiveProps, 'validationState'>
>;

export type RadioGroupProps = ExtendableComponentPropsWithRef<
  RadioGroupBaseProps,
  'div'
>;
