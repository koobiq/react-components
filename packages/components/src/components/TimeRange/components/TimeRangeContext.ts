'use client';

import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

type TimeRangeContextValue = {
  formattedValue: string;
  isEmpty: boolean;
  isDisabled?: boolean;
  groupRef: RefObject<HTMLDivElement | null>;
};

export const TimeRangeContext = createContext<TimeRangeContextValue | null>(
  null
);

export function useTimeRangeContext() {
  const context = useContext(TimeRangeContext);

  if (!context) {
    throw new Error('TimeRange.Field must be rendered within a TimeRange.');
  }

  return context;
}
