import type { ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { HoverEvent, UseButtonProps } from '@koobiq/react-primitives';

export const buttonPropVariant = [
  'contrast-filled',
  'contrast-transparent',
  'fade-contrast-filled',
  'fade-contrast-outline',
  'fade-theme-outline',
  'theme-transparent',
] as const;

export type ButtonPropVariant = (typeof buttonPropVariant)[number];

export type ButtonBaseProps = ExtendableProps<
  {
    /** The content of the component. */
    children?: ReactNode;
    /**
     * The variant to use.
     * @default contrast-filled
     * */
    variant?: ButtonPropVariant;
    /**
     * If `true`, the progress indicator is shown and the button becomes disabled.
     * @default false
     * */
    progress?: boolean;
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /**
     * If `true`, only the icon is shown, and the button has same sides.
     * @default false
     * */
    onlyIcon?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /**
     * If `true`, the button will take up the full width of its container.
     * @default false
     * */
    fullWidth?: boolean;
    /** Icon placed before the children. */
    startIcon?: ReactNode;
    /** Icon placed after the children. */
    endIcon?: ReactNode;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** Handler that is called when a hover interaction starts. */
    onHoverStart?: (e: HoverEvent) => void;
    /** Handler that is called when a hover interaction ends. */
    onHoverEnd?: (e: HoverEvent) => void;
  },
  UseButtonProps
>;
