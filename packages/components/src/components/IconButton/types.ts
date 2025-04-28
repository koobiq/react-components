import type { ReactNode } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { HoverEvent, UseButtonProps } from '@koobiq/react-primitives';

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

export type IconButtonBaseProps = ExtendableProps<
  {
    /** The content of the component. */
    children?: ReactNode;
    /**
     * The variant to use.
     * @default theme
     * */
    variant?: IconButtonPropVariant;
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /**
     * Size of the component
     * @default xl
     * */
    size?: IconButtonPropSize;
    /**
     * If `true`, reduce the size of the component canvas.
     * @default false
     * */
    compact?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Handler that is called when a hover interaction starts. */
    onHoverStart?: (e: HoverEvent) => void;
    /** Handler that is called when a hover interaction ends. */
    onHoverEnd?: (e: HoverEvent) => void;
  },
  UseButtonProps
>;
