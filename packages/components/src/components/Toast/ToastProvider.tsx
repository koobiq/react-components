'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import type { ToastOptions } from '@koobiq/react-primitives';
import { useToastQueue } from '@koobiq/react-primitives';

import { ToastRegion } from './components';
import type { ToastProps } from './index';
import { ToastQueue } from './MyToastQueue';
import type { ToastProviderComponent, ToastProviderProps } from './types';

let globalToastQueue: ToastQueue<ToastProps> | null = null;

export const getToastQueue = (maxVisibleToasts = 5) => {
  if (!globalToastQueue) {
    globalToastQueue = new ToastQueue({
      maxVisibleToasts,
    });
  }

  return globalToastQueue;
};

function ToastProviderRender(
  props: ToastProviderProps,
  ref: Ref<HTMLDivElement>
) {
  const state = useToastQueue(getToastQueue(props.maxVisibleToasts));

  return <ToastRegion {...props} ref={ref} state={state} />;
}

export const ToastProvider = forwardRef(
  ToastProviderRender
) as ToastProviderComponent;

const add = ({ ...props }: ToastProps & ToastOptions) => {
  if (!globalToastQueue) {
    return null;
  }

  return globalToastQueue.add(props, {
    timeout: props.timeout,
    onClose: props.onClose,
  });
};

export const close = (key: string) => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.close(key);
};

export const clear = () => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.clear();
};

export const toast = { add, close, clear };
