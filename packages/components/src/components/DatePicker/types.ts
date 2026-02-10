import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { AriaDatePickerProps, DateValue } from '@koobiq/react-primitives';

import type { CalendarProps } from '../Calendar';
import type {
  DateInputPropLabelAlign,
  DateInputPropLabelPlacement,
  DateInputProps,
  DateInputRef,
} from '../DateInput';
import type { FormFieldLabelProps } from '../FormField';
import type { PopoverProps } from '../Popover';

export type DatePickerProps<T extends DateValue> = {
  /**
   * If true, the input will take up the full width of its container.
   */
  fullWidth?: boolean;
  /** The helper text content. */
  caption?: ReactNode;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: DateInputPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: DateInputPropLabelAlign;
  /** Ref to the DateInput. */
  ref?: Ref<DateInputRef>;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: DateInputProps<T>;
    /** @deprecated */
    label?: FormFieldLabelProps;
    popover?: PopoverProps;
    calendar?: CalendarProps<T>;
  };
} & Omit<AriaDatePickerProps<T>, 'description' | 'validationState'>;

export type DatePickerComponent = <T extends DateValue>(
  props: DatePickerProps<T>
) => ReactElement | null;

export type DatePickerRef = DateInputRef;
