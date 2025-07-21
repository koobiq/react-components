import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

export const checkboxPropSize = ['normal', 'big'] as const;

export type CheckboxPropSize = (typeof checkboxPropSize)[number];

export const checkboxPropLabelPlacement = ['start', 'end'] as const;

export type CheckboxPropLabelPlacement =
  (typeof checkboxPropLabelPlacement)[number];

export type CheckboxPropOnChange = (selected: boolean) => void;

type CheckboxDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @default false
   *
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the component will indicate an error.
   * @default false
   *
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * If `true`, the component is checked.
   *
   * @deprecated
   * The "checked" prop is deprecated. Use "isSelected" prop to replace it.
   */
  checked?: boolean;
  /**
   * It prevents the user from changing the value of the checkbox.
   * @default false
   *
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadonly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * If `true`, the input element is required.
   * @default false
   *
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
  /**
   * If `true`, the component appears indeterminate.
   * @default false
   *
   * @deprecated
   * The "indeterminate" prop is deprecated. Use "isIndeterminate" prop to replace it.
   */
  indeterminate?: boolean;
  /**
   * The default checked state. Use when the component is not controlled.
   *
   * @deprecated
   * The "defaultChecked" prop is deprecated. Use "defaultSelected" prop to replace it.
   */
  defaultChecked?: boolean;
};

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
  /**
   * If `true`, the component will indicate an error.
   * @default false
   */
  isInvalid?: boolean;
  /** If `true`, the component is checked. */
  isSelected?: boolean;
  /**
   * It prevents the user from changing the value of the checkbox.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the input element is required.
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `true`, the component appears indeterminate.
   * @default false
   */
  isIndeterminate?: boolean;
  /** The default checked state. Use when the component is not controlled. */
  defaultSelected?: boolean;
  /** Callback fired when the state is changed. */
  onChange?: CheckboxPropOnChange;
  /** The props used for each slot inside. */
  slotProps?: {
    box?: ComponentPropsWithRef<'span'>;
    label?: ComponentPropsWithRef<'span'>;
  };
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
} & CheckboxDeprecatedProps;
