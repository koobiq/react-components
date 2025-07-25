import type { CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { ButtonBaseProps as ButtonBasePrimitiveProps } from '@koobiq/react-primitives';

export const buttonPropVariant = [
  'contrast-filled',
  'contrast-transparent',
  'fade-contrast-filled',
  'fade-contrast-outline',
  'fade-theme-outline',
  'theme-transparent',
] as const;

export type ButtonPropVariant = (typeof buttonPropVariant)[number];

type ButtonDeprecatedProps = {
  /**
   * If `true`, the progress indicator is shown and the button becomes disabled.
   * @default false
   * @deprecated
   * The "progress" prop is deprecated. Use "isLoading" prop to replace it.
   */
  progress?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
};

export type ButtonBaseProps = ExtendableProps<
  {
    /** The content of the component. */
    children?: ReactNode;
    /**
     * The variant to use.
     * @default 'contrast-filled'
     */
    variant?: ButtonPropVariant;
    /**
     * If `true`, only the icon is shown, and the button has same sides.
     * @default false
     */
    onlyIcon?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /**
     * If `true`, the button will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /** Icon placed before the children. */
    startIcon?: ReactNode;
    /** Icon placed after the children. */
    endIcon?: ReactNode;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
  } & ButtonDeprecatedProps,
  Omit<ButtonBasePrimitiveProps, 'slot'>
>;
