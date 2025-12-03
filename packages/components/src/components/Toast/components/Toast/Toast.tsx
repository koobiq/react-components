'use client';

import { clsx, isNotNil, useDOMRef } from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';
import { useToast } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import { Typography } from '../../../Typography';

import s from './Toast.module.css';
import { ToastStatusIcon } from './ToastStatusIcon';
import type { ToastProps } from './types';

const { typography } = utilClasses;

export function Toast({
  state,
  innerRef,
  'data-transition': transition,
  ...props
}: ToastProps) {
  const domRef = useDOMRef<HTMLDivElement>(innerRef);

  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    domRef
  );

  const {
    toast: {
      content: { status = 'info', title, description, action } = {},
    } = {},
  } = props;

  return (
    <div
      {...toastProps}
      ref={domRef}
      data-status={status}
      data-transition={transition}
      className={clsx(s.base, s[status], typography['text-normal'])}
    >
      <ToastStatusIcon status={status} />
      <div {...contentProps} className={clsx(s.content)}>
        {isNotNil(title) && <Typography {...titleProps}>{title}</Typography>}
        {isNotNil(description) && (
          <Typography color="contrast-secondary">{description}</Typography>
        )}
        {isNotNil(action) && <span className={s.action}>{action}</span>}
      </div>
      <IconButton
        {...closeButtonProps}
        variant="theme-contrast"
        className={s.closeIcon}
      >
        <IconXmarkS16 />
      </IconButton>
    </div>
  );
}
