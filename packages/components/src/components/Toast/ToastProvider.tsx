'use client';

import type { ReactNode, ReactElement } from 'react';

import { useToastState } from '@koobiq/react-primitives';

import { ToastRegion } from './components';

export type ToastProviderProps = {
  children?: (state: any) => ReactElement;
};

export function ToastProvider<T extends ReactNode>({
  children,
  ...props
}: ToastProviderProps) {
  const state = useToastState<T>({
    maxVisibleToasts: 5,
  });

  return (
    <>
      {children?.(state)}
      {<ToastRegion {...props} state={state} />}
    </>
  );
}
