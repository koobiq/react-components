'use client';

import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { useToastState } from '@koobiq/react-primitives';

import { ToastRegion } from './components';
import type { ToastProviderComponent, ToastProviderProps } from './types';

function ToastProviderRender<T extends ReactNode>(props: ToastProviderProps) {
  const { children } = props;

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

export const ToastProvider = forwardRef(
  ToastProviderRender
) as ToastProviderComponent;
