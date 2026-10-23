import type { FormFieldLabelProps } from '../Typography';
export type DatePickerProps = {
    /** The content to display as the label. */
    label?: import("react").ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
        /** @deprecated */
        label?: FormFieldLabelProps;
        popover?: object;
    };
};
export declare const DatePicker: import("react").ForwardRefExoticComponent<DatePickerProps>;
