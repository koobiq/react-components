import { type ComponentRef, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconChevronLeft16, IconChevronRight16 } from '@koobiq/react-icons';

import { IconButton, type IconButtonProps } from '../../../IconButton';

import s from './TabScrollButton.module.css';

export type TabScrollButtonProps = {
  dir?: 'next' | 'prev';
  isInvisible?: boolean;
} & IconButtonProps;

export const TabScrollButton = forwardRef<
  ComponentRef<'button'>,
  TabScrollButtonProps
>((props, ref) => {
  const { dir = 'prev', isInvisible = false, className, ...other } = props;

  return (
    <IconButton
      key={dir}
      type="button"
      tabIndex={-1}
      variant="theme-contrast"
      className={clsx(s.base, s[dir], isInvisible && s.invisible, className)}
      ref={ref}
      {...other}
    >
      {dir === 'prev' ? <IconChevronLeft16 /> : <IconChevronRight16 />}
    </IconButton>
  );
});

TabScrollButton.displayName = 'TabScrollButton';
