import type { ComponentRef, CSSProperties, ReactElement } from 'react';

import type { AriaDateFieldProps, DateValue } from '@koobiq/react-primitives';

import type {
  FieldCaptionProps,
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
  };
} & AriaDateFieldProps<T>;

export type DateInputComponentProp = <T extends DateValue>(
  props: DateInputProps<T>
) => ReactElement | null;

export type DateInputRef = ComponentRef<'div'>;
