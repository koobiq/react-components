import type { FormFieldLabelProps } from '../Typography';
export declare const inputPropVariant: readonly ["filled", "transparent"];
export type InputPropVariant = (typeof inputPropVariant)[number];
/**
 * Like the real build, the deprecated props are inlined without their JSDoc,
 * so only the runtime deprecate() messages reveal them.
 */
export declare const Input: import("react").ForwardRefExoticComponent<{
    disabled?: boolean;
    readonly?: boolean;
} & {
    variant?: InputPropVariant;
    slotProps?: {
        label?: FormFieldLabelProps;
    };
}>;
