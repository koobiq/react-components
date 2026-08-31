'use client';

import { createContext, useContext } from 'react';
import type { Ref } from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

export type TimeRangeTriggerContextValue = {
  formattedValue: string;
  isOpen: boolean;
  isEmpty: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  buttonProps: ButtonOptions & { ref: Ref<HTMLButtonElement> };
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
