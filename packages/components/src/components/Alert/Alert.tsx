'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import { IconXmark16 } from '@koobiq/react-icons';
import { useLocalizedStringFormatter } from '@koobiq/react-primitives';

import { IconButton } from '../IconButton';

import s from './Alert.module.css';
import { AlertIcon } from './components';
import type { AlertBaseProps } from './index';
import intlMessages from './intl.json';

export const Alert = polymorphicForwardRef<'div', AlertBaseProps>(
  (
    {
      status = 'info',
      colored = false,
      compact = false,
      as: Tag = 'div',
      hideIcon = false,
      slotProps,
      icon,
      onClose,
      action,
      title,
      className,
      children,
      ...other
    },
    ref
  ) => {
    const stringFormatter = useLocalizedStringFormatter(intlMessages);

    const contentProps = mergeProps(
      {
        className: s.content,
      },
      slotProps?.content
    );

    const statusIcon = mergeProps(
      {
        icon,
        status,
        compact,
      },
      slotProps?.statusIcon
    );

    const closeIcon = mergeProps(
      {
        'aria-label': stringFormatter.format('close'),
        variant: 'fade-contrast',
        onClick: onClose,
        className: s.closeIcon,
      },
      slotProps?.closeIcon
    );

    return (
      <Tag
        role="alert"
        {...other}
        ref={ref}
        className={clsx(
          s.base,
          s[status],
          compact && s.compact,
          colored && s.colored,
          className
        )}
      >
        {!hideIcon && <AlertIcon {...statusIcon} />}
        <div {...contentProps}>
          {isNotNil(title) && <span className={s.title}>{title}</span>}
          {isNotNil(children) && <span className={s.body}>{children}</span>}
          {isNotNil(action) && <span className={s.action}>{action}</span>}
        </div>
        {isNotNil(onClose) && typeof onClose === 'function' && (
          <IconButton {...closeIcon}>
            {closeIcon.children || <IconXmark16 />}
          </IconButton>
        )}
      </Tag>
    );
  }
);

export type AlertProps<As extends ElementType = 'div'> = ComponentPropsWithRef<
  typeof Alert<As>
>;
