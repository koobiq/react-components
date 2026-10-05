import type { ReactNode } from 'react';
import type { ExtendableProps } from '@koobiq/react-core';
export declare const buttonPropVariant: readonly ["contrast-filled", "fade-contrast-filled", "fade-contrast-outline", "theme-transparent"];
export type ButtonPropVariant = (typeof buttonPropVariant)[number];
type ButtonDeprecatedProps = {
    /**
     * If `true`, the progress indicator is shown and the button becomes disabled.
     * @deprecated
     * The "progress" prop is deprecated. Use "isLoading" prop to replace it.
     */
    progress?: boolean;
    /**
     * If `true`, the component is disabled.
     * @deprecated
     * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
     */
    disabled?: boolean;
};
export type ButtonBaseProps = ExtendableProps<{
    /** The content of the component. */
    children?: ReactNode;
    /**
     * The variant to use.
     * @default 'contrast-filled'
     */
    variant?: ButtonPropVariant;
    /** If `true`, only the icon is shown. */
    onlyIcon?: boolean;
} & ButtonDeprecatedProps, object>;
