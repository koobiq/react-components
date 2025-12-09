'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import type { ToastOptions } from '@koobiq/react-primitives';
import { useToastQueue } from '@koobiq/react-primitives';

import { ToastRegion } from './components';
import type { ToastProps } from './index';
import { ToastQueue } from './KbqToastQueue';
import type { ToastProviderComponent, ToastProviderProps } from './types';

let globalToastQueue: ToastQueue<ToastProps> | null = null;

const MIN_TIMEOUT = 5000;

export const getToastQueue = (maxVisibleToasts = Infinity) => {
  if (!globalToastQueue) {
    globalToastQueue = new ToastQueue({
      maxVisibleToasts:
        maxVisibleToasts === Infinity ? undefined : maxVisibleToasts,
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
    timeout:
      props.timeout === Infinity
        ? undefined
        : Math.max(props.timeout || MIN_TIMEOUT, MIN_TIMEOUT),
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

export const resumeAll = () => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.resumeAll();
};

export const pauseAll = () => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.pauseAll();
};

export const closeAll = () => {
  if (!globalToastQueue) {
    return;
  }

  [...globalToastQueue.visibleToasts].forEach((toast) => {
    close(toast.key);
  });
};

export const toast = { add, close, clear };
