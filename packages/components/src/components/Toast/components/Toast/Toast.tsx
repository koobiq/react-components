'use client';

import { clsx, isNotNil, useDOMRef, mergeProps } from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';
import { useToast } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { IconButton } from '../../../IconButton';
import { Typography } from '../../../Typography';

import s from './Toast.module.css';
import { ToastStatusIcon } from './ToastStatusIcon';
import type { ToastProps } from './types';

const { typography } = utilClasses;

export function Toast({ state, style, innerRef, ...props }: ToastProps) {
  const domRef = useDOMRef<HTMLDivElement>(innerRef);

  const {
    titleProps,
    descriptionProps,
    toastProps: toastPropsAria,
    contentProps: contentPropsAria,
    closeButtonProps: closeButtonPropsAria,
  } = useToast(props, state, domRef);

  const {
    toast: {
      content: {
        status = 'info',
        title,
        caption,
        action,
        props: {
          slotProps,
          icon,
          hideIcon,
          hideCloseButton,
          style: componentStyle,
          ...componentProps
        } = {},
      } = {},
    } = {},
  } = props;

  const toastProps = mergeProps(toastPropsAria, componentProps, {
    style: { ...componentStyle, ...style },
    ref: domRef,
    'data-status': status,
    className: clsx(s.base, s[status], typography['text-normal']),
  });

  const contentProps = mergeProps(
    contentPropsAria,
    { className: s.content },
    slotProps?.content
  );

  const closeButtonProps = mergeProps(
    closeButtonPropsAria,
    { variant: 'theme-contrast', className: s.closeIcon },
    slotProps?.closeIcon
  );

  return (
    <div {...toastProps}>
      <div className={s.wrapper}>
        {!hideCloseButton && (
          <IconButton {...closeButtonProps}>
            <IconXmarkS16 />
          </IconButton>
        )}
        {!hideIcon && (
          <ToastStatusIcon
            icon={icon}
            status={status}
            {...slotProps?.statusIcon}
          />
        )}
        <div {...contentProps}>
          {isNotNil(title) && (
            <Typography as="span" {...titleProps}>
              {title}
            </Typography>
          )}
          {isNotNil(caption) && (
            <Typography
              as="span"
              color="contrast-secondary"
              {...descriptionProps}
            >
              {caption}
            </Typography>
          )}
          {isNotNil(action) && <span className={s.action}>{action}</span>}
        </div>
      </div>
    </div>
  );
}
