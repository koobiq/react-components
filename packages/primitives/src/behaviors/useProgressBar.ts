'use client';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaProgressBarProps } from '@react-aria/progress';
import { useProgressBar as useProgressBarReactAria } from '@react-aria/progress';

export type UseProgressBarProps = ExtendableProps<
  Omit<AriaProgressBarProps, 'isIndeterminate'>,
  { indeterminate?: boolean }
>;

export function useProgressBar(props: UseProgressBarProps) {
  const { indeterminate, ...other } = props;

  return useProgressBarReactAria({ ...other, isIndeterminate: indeterminate });
}

export type UseProgressBarReturn = ReturnType<typeof useProgressBar>;
