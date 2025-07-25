import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { SwitchProps } from '@koobiq/react-primitives';

export const togglePropSize = ['normal', 'big'] as const;

export type TogglePropSize = (typeof togglePropSize)[number];

export const togglePropLabelPlacement = ['start', 'end'] as const;

export type TogglePropLabelPlacement =
  (typeof togglePropLabelPlacement)[number];

type ToggleDeprecatedProps = {
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
   * If `true`, the component is checked.
   * @deprecated
   * The "checked" prop is deprecated. Use "isSelected" prop to replace it.
   */
  checked?: boolean;
  /**
   * It prevents the user from changing the value of the checkbox.
   * @default false
   * @deprecated
   * The "readonly" prop is deprecated. Use "isReadonly" prop to replace it.
   */
  readonly?: boolean;
  /**
   * The default checked state. Use when the component is not controlled.
   * @deprecated
   * The "defaultChecked" prop is deprecated. Use "defaultSelected" prop to replace it.
   */
  defaultChecked?: boolean;
};

export type ToggleProps = ExtendableProps<
  {
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
    size?: TogglePropSize;
    /**
     * The position of the label.
     * @default 'end'
     */
    labelPlacement?: TogglePropLabelPlacement;
    /** The props used for each slot inside. */
    slotProps?: {
      track?: ComponentPropsWithRef<'span'>;
      label?: ComponentPropsWithRef<'span'>;
    };
  } & ToggleDeprecatedProps,
  Omit<SwitchProps, 'inputRef'>
>;
