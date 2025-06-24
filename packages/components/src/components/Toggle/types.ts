import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type { UseToggleProps } from '@koobiq/react-primitives';

export const togglePropSize = ['normal', 'big'] as const;

export type TogglePropSize = (typeof togglePropSize)[number];

export const togglePropLabelPlacement = ['start', 'end'] as const;

export type TogglePropLabelPlacement =
  (typeof togglePropLabelPlacement)[number];

type ToggleDeprecatedProps = {
  /**
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   * If `true`, the component is disabled.
   * @default false
   * */
  disabled?: boolean;
  /**
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   * If `true`, the component will indicate an error.
   * @default false
   * */
  error?: boolean;
  /**
   * @deprecated
   * The "checked" prop is deprecated. Use "isSelected" prop to replace it.
   * If `true`, the component is checked.
   * @default false
   * */
  checked?: boolean;
  /**
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadonly" prop to replace it.
   * It prevents the user from changing the value of the checkbox.
   * @default false
   */
  readonly?: boolean;
  /**
   * @deprecated
   * The "defaultChecked" prop is deprecated. Use "defaultSelected" prop to replace it.
   * The default checked state. Use when the component is not controlled.
   * @default false
   * */
  defaultChecked?: boolean;
};

export type ToggleProps = UseToggleProps & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /**
   * Size.
   * @default normal
   * */
  size?: TogglePropSize;
  /**
   * The position of the label.
   * @default end
   * */
  labelPlacement?: TogglePropLabelPlacement;
  /** The props used for each slot inside. */
  slotProps?: {
    track?: ComponentPropsWithRef<'span'>;
    label?: ComponentPropsWithRef<'span'>;
  };
  /**
   * If `true`, the component will indicate an error.
   * @default false
   * */
  isInvalid?: boolean;
  /**
   * If `true`, the component is checked.
   * @default false
   * */
  isSelected?: boolean;
  /** It prevents the user from changing the value of the checkbox.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   * */
  isDisabled?: boolean;
  /**
   * The default checked state. Use when the component is not controlled.
   * @default false
   * */
  defaultSelected?: boolean;
} & ToggleDeprecatedProps;
