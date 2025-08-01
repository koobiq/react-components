import type { CSSProperties, ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { ButtonBaseProps as ButtonBasePrimitiveProps } from '@koobiq/react-primitives';

export const iconButtonPropVariant = [
  'theme',
  'theme-contrast',
  'fade-contrast',
  'error',
  'success',
  'warning',
] as const;

export type IconButtonPropVariant = (typeof iconButtonPropVariant)[number];

export const iconButtonPropSize = ['l', 'xl'] as const;

export type IconButtonPropSize = (typeof iconButtonPropSize)[number];

type IconButtonBaseDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @default false
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, reduce the size of the component canvas.
   * @default false
   * @deprecated
   * The "compact" prop is deprecated. Use "isCompact" prop to replace it.
   */
  compact?: boolean;
};

export type IconButtonBaseProps = ExtendableProps<
  {
    /** The content of the component. */
    children?: ReactNode;
    /**
     * The variant to use.
     * @default 'theme'
     */
    variant?: IconButtonPropVariant;
    /**
     * Size of the component
     * @default 'xl'
     */
    size?: IconButtonPropSize;
    /**
     * If `true`, reduce the size of the component canvas.
     * @default false
     */
    isCompact?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
  } & IconButtonBaseDeprecatedProps,
  Omit<ButtonBasePrimitiveProps, 'slot' | 'isLoading'>
>;
