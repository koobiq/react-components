'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import type { ToastOptions } from '@koobiq/react-primitives';
import { useToastQueue } from '@koobiq/react-primitives';

import { ToastRegion } from './components';
import type { ToastContentProps } from './components';
import { ToastQueue } from './KbqToastQueue';
import type { ToastProviderComponent, ToastProviderProps } from './types';

let globalToastQueue: ToastQueue<ToastContentProps> | null = null;

const MIN_TIMEOUT = 5000;

export const getToastQueue = () => {
  if (!globalToastQueue) {
    globalToastQueue = new ToastQueue();
  }

  return globalToastQueue;
};

const add = ({ ...props }: ToastContentProps & ToastOptions) => {
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

const close = (key: string) => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.close(key);
};

const clear = () => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.clear();
};

const resumeAll = () => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.resumeAll();
};

const pauseAll = () => {
  if (!globalToastQueue) {
    return;
  }

  globalToastQueue?.pauseAll();
};

const closeAll = () => {
  if (!globalToastQueue) {
    return;
  }

  [...globalToastQueue.visibleToasts].forEach((toast) => {
    close(toast.key);
  });
};

const getToasts = () => {
  if (!globalToastQueue) {
    return null;
  }

  return globalToastQueue.visibleToasts;
};

export const toast = {
  add,
  close,
  clear,
  closeAll,
  resumeAll,
  pauseAll,
  getToasts,
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
