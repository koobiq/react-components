'use client';

import { type ReactNode, type Ref } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import { IconCircleInfo16, IconXmarkS16 } from '@koobiq/react-icons';
import {
  type AriaToastProps,
  type ToastState,
  useToast,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';

import s from './Toast.module.css';

const { typography } = utilClasses;

export type ToastProps<T> = AriaToastProps<T> & {
  state: ToastState<T>;
  innerRef: Ref<HTMLDivElement>;
  'data-transition'?: string;
};

export function Toast<T extends ReactNode>({
  state,
  innerRef,
  'data-transition': transition,
  ...props
}: ToastProps<T>) {
  const domRef = useDOMRef<HTMLDivElement>(innerRef);

  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    domRef
  );

  return (
    <div
      {...toastProps}
      ref={domRef}
      data-transition={transition}
      className={clsx(s.base, typography['text-normal'])}
    >
      <IconCircleInfo16 className={s.icon} />
      <div {...contentProps} className={clsx(s.content)}>
        <div {...titleProps}>{props.toast.content}</div>
      </div>
      <IconButton
        {...closeButtonProps}
        variant="theme-contrast"
        className={s.close}
      >
        <IconXmarkS16 />
      </IconButton>
    </div>
  );
}
