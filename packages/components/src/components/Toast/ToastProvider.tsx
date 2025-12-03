'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import type { ToastOptions } from '@koobiq/react-primitives';
import { useToastQueue, ToastQueue } from '@koobiq/react-primitives';

import { ToastRegion } from './components';
import type { ToastProps } from './index';
import type { ToastProviderComponent, ToastProviderProps } from './types';

let globalToastQueue: ToastQueue<ToastProps> | null = null;

export const getToastQueue = () => {
  if (!globalToastQueue) {
    globalToastQueue = new ToastQueue({
      maxVisibleToasts: Infinity,
    });
  }

  return globalToastQueue;
};

function ToastProviderRender(
  props: ToastProviderProps,
  ref: Ref<HTMLDivElement>
) {
  const state = useToastQueue(getToastQueue());

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

const closingToasts = new Map<string, ReturnType<typeof setTimeout>>();

export const close = (key: string) => {
  if (!globalToastQueue) {
    return;
  }

  if (closingToasts.has(key)) {
    return;
  }

  const timeoutId = setTimeout(() => {
    closingToasts.delete(key);
    globalToastQueue?.close(key);
  }, 300);

  closingToasts.set(key, timeoutId);
};

export const toast = { add, close };
