import type { FormFieldLabelProps } from '../Typography';
export type SelectNextProps = {
    label?: import("react").ReactNode;
    selectedKey?: string;
    onSelectionChange?: (key: string) => void;
    slotProps?: {
        label?: FormFieldLabelProps;
    };
};
export declare const SelectNext: import("react").ForwardRefExoticComponent<SelectNextProps>;
