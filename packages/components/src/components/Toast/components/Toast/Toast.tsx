import { type ReactNode, useRef } from 'react';

import { clsx } from '@koobiq/react-core';
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
};

export function Toast<T extends ReactNode>({ state, ...props }: ToastProps<T>) {
  const ref = useRef(null);

  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref
  );

  return (
    <div
      {...toastProps}
      ref={ref}
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
