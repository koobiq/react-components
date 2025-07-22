import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';
import type { RadioGroupProps as RadioGroupPrimitiveProps } from '@koobiq/react-primitives';

import type {
  RadioGroupDescriptionProps,
  RadioGroupLabelProps,
} from './components';

export const radioGroupPropSize = ['normal', 'big'] as const;

export type RadioGroupPropSize = (typeof radioGroupPropSize)[number];

export const radioGroupPropOrientation = ['horizontal', 'vertical'] as const;

export type RadioGroupPropOrientation =
  (typeof radioGroupPropOrientation)[number];

type RadioGroupDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @default false
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the component will indicate an error.
   * @default false
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * It prevents the user from changing the value of the checkbox.
   * @default false
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadonly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * If `true`, the input element is required.
   * @default false
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
};

export type RadioGroupBaseProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
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
    /** The props used for each slot inside. */
    slotProps?: {
      root?: ComponentPropsWithRef<'div'>;
      description?: RadioGroupDescriptionProps;
      label?: RadioGroupLabelProps;
    };
  } & RadioGroupDeprecatedProps,
  Omit<
    RadioGroupPrimitiveProps,
    'validate' | 'validationBehavior' | 'validationState' | 'errorMessage'
  >
>;

export type RadioGroupProps = ExtendableComponentPropsWithRef<
  RadioGroupBaseProps,
  'div'
>;
