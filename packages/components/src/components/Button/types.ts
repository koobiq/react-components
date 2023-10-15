import type { ReactNode } from 'react';

export const buttonPropVariant = [
  'contrast-filled',
  'contrast-transparent',
  'fade-contrast-filled',
  'fade-contrast-outline',
  'fade-theme-outline',
  'theme-transparent',
] as const;

export type ButtonPropVariant = (typeof buttonPropVariant)[number];

export type ButtonBaseProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** The variant to use. */
  variant?: ButtonPropVariant;
  /** If `true`, the progress indicator is shown and the button becomes disabled. */
  progress?: boolean;
  /** If `true`, the component is disabled. */
  disabled?: boolean;
  onlyIcon?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** If `true`, the button will take up the full width of its container. */
  fullWidth?: boolean;
  /** Icon placed before the children. */
  startIcon?: ReactNode;
  /** Icon placed after the children. */
  endIcon?: ReactNode;
};
