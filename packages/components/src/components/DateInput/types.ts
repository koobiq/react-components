import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from 'react';

import type { AriaDateFieldProps, DateValue } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
  FieldErrorProps,
  FieldInputDateProps,
  FieldInputGroupProps,
  FieldLabelProps,
} from '../FieldComponents';

export type DateInputProps<T extends DateValue = DateValue> = {
  /** Inline styles. */
  style?: CSSProperties;
  /** The helper text content. */
  caption?: string | number;
  /** The props used for each slot inside. */
  slotProps?: {
    label?: FieldLabelProps;
    group?: FieldInputGroupProps;
    caption?: FieldCaptionProps;
    inputDate?: FieldInputDateProps;
    errorMessage?: FieldErrorProps;
  };
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   */
  isLabelHidden?: boolean;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
} & Omit<AriaDateFieldProps<T>, 'description'>;

export type DateInputComponentProp = <T extends DateValue>(
  props: DateInputProps<T>
) => ReactElement | null;

export type DateInputRef = ComponentRef<'div'>;
