'use client';

import { createContext, useContext } from 'react';
import type { ReactNode, Ref } from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

import type {
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldProps,
  FormFieldPropLabelAlign,
  FormFieldPropLabelPlacement,
} from '../../FormField';

/** Only consumed by the default trigger — a custom trigger ignores it entirely. */
export type TimeRangeTriggerFormFieldContext = {
  label?: ReactNode;
  isLabelHidden?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  caption?: ReactNode;
  fullWidth?: boolean;
  labelPlacement?: FormFieldPropLabelPlacement;
  labelAlign?: FormFieldPropLabelAlign;
  /** The anchor the popover positions itself against. */
  groupRef: Ref<HTMLDivElement>;
  slotProps?: {
    root?: FormFieldProps;
    label?: FormFieldLabelProps;
    group?: FormFieldControlGroupProps;
    caption?: FormFieldCaptionProps;
    errorMessage?: FormFieldErrorProps;
  };
};

export type TimeRangeTriggerContextValue = {
  formattedValue: string;
  isOpen: boolean;
  isEmpty: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  buttonProps: ButtonOptions & { ref: Ref<HTMLButtonElement> };
  formField: TimeRangeTriggerFormFieldContext;
};

export const TimeRangeTriggerContext =
  createContext<TimeRangeTriggerContextValue | null>(null);

export function useTimeRangeTriggerContext(): TimeRangeTriggerContextValue {
  const context = useContext(TimeRangeTriggerContext);

  if (!context) {
    throw new Error('TimeRange.Trigger must be rendered within a TimeRange.');
  }

  return context;
}
