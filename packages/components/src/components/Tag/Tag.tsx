'use client';

import { forwardRef, type ComponentRef } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconXmarkS16 } from '@koobiq/react-icons';

import { utilClasses } from '../../styles/utility';
import { IconButton } from '../IconButton';

import intlMessages from './intl.json';
import s from './Tag.module.css';
import type { TagProps, TagRemoveButtonProps } from './types';
import { matchTagVariantToIconButton } from './utils';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export const Tag = forwardRef<ComponentRef<'div'>, TagProps>((props, ref) => {
  const {
    variant = 'theme-fade',
    allowsRemoving,
    icon,
    className,
    style,
    children,
    slotProps,
    isDisabled,
    ...other
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const rootProps = mergeProps(
    {
      ref,
      style,
      'data-variant': variant,
      'data-disabled': isDisabled || undefined,
      className: clsx(s.base, s[variant], textNormalMedium, className),
    },
    other
  );

  const bodyProps = mergeProps({ className: s.body }, slotProps?.body);

  const contentProps = mergeProps({ className: s.content }, slotProps?.content);

  const iconProps = mergeProps({ className: s.icon }, slotProps?.icon);

  const removeButtonProps = mergeProps<
    [TagRemoveButtonProps, TagRemoveButtonProps | undefined]
  >(
    {
      isDisabled,
      isCompact: true,
      size: 'l',
      className: s.cancelIcon,
      children: <IconXmarkS16 />,
      variant: matchTagVariantToIconButton[variant],
      'aria-label': t.format('remove'),
    },
    slotProps?.removeIcon
  );

  return (
    <div {...rootProps}>
      <div {...bodyProps}>
        {isNotNil(icon) && <span {...iconProps}>{icon}</span>}
        {isNotNil(children) && <span {...contentProps}>{children}</span>}
        {allowsRemoving && <IconButton {...removeButtonProps} />}
      </div>
    </div>
  );
});

Tag.displayName = 'Tag';
