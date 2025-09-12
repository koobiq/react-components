'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import {
  clsx,
  isNotNil,
  mergeProps,
  polymorphicForwardRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconXmark16 } from '@koobiq/react-icons';

import { IconButton } from '../IconButton';

import s from './Alert.module.css';
import { AlertIcon } from './components';
import type { AlertBaseProps } from './index';
import intlMessages from './intl.json';

export const Alert = polymorphicForwardRef<'div', AlertBaseProps>(
  (props, ref) => {
    const {
      status = 'info',
      as: Tag = 'div',
      hideIcon,
      colored,
      compact,
      isColored: isColoredProp,
      isCompact: isCompactProp,
      slotProps,
      icon,
      onClose,
      action,
      title,
      className,
      children,
      ...other
    } = props;

    const isColored = isColoredProp ?? colored;
    const isCompact = isCompactProp ?? compact;

    if (process.env.NODE_ENV !== 'production' && 'colored' in props) {
      deprecate(
        'Alert: the "colored" prop is deprecated. Use "isColored" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'compact' in props) {
      deprecate(
        'Alert: the "compact" prop is deprecated. Use "isCompact" prop to replace it.'
      );
    }

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
        isCompact,
      },
      slotProps?.statusIcon
    );

    const closeIcon = mergeProps(
      {
        'aria-label': stringFormatter.format('close'),
        variant: 'fade-contrast',
        onPress: onClose,
        className: s.closeIcon,
      },
      slotProps?.closeIcon
    );

    return (
      <Tag
        role="alert"
        data-colored={isColored || undefined}
        data-compact={isCompact || undefined}
        {...other}
        ref={ref}
        className={clsx(
          s.base,
          s[status],
          isCompact && s.compact,
          isColored && s.colored,
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
