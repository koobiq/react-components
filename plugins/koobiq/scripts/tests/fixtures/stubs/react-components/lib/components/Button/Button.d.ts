import type { ComponentPropsWithRef, ElementType } from 'react';
import type { ButtonBaseProps } from './types.js';
/** The Button is a clickable UI component that triggers actions or events. */
export declare const Button: import("@koobiq/react-core").PolyForwardComponent<"button", ButtonBaseProps, ElementType>;
export type ButtonProps<As extends ElementType = 'button'> = ComponentPropsWithRef<typeof Button<As>>;
