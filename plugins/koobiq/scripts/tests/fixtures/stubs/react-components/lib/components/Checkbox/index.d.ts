type CheckboxDeprecatedProps = {
    /**
     * @deprecated
     * The "checked" prop is deprecated. Use "isSelected" prop to replace it.
     */
    checked?: boolean;
    /**
     * @deprecated
     * The "readonly" prop is deprecated. Use "isReadonly" prop to replace it.
     */
    readonly?: boolean;
};
export type CheckboxProps = {
    children?: import("react").ReactNode;
    isSelected?: boolean;
    isReadOnly?: boolean;
} & CheckboxDeprecatedProps;
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps>;
