'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  clsx,
  mergeProps,
  polymorphicForwardRef,
  useObjectRef,
} from '@koobiq/react-core';
import { useToolbar } from '@koobiq/react-primitives';

import s from './TopBarContainer.module.css';
import type { TopBarContainerBaseProps } from './types';

/** TopBar.Container groups the content on one side of the top bar. */
export const TopBarContainer = polymorphicForwardRef<
  'div',
  TopBarContainerBaseProps
>((props, ref) => {
  const {
    as: Tag = 'div',
    placement = 'start',
    isToolbar = false,
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...other
  } = props;

  const containerRef = useObjectRef(ref);

  const { toolbarProps } = useToolbar(
    {
      orientation: 'horizontal',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
    },
    containerRef
  );

  const rootProps = mergeProps(
    other,
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'data-placement': placement,
      className: clsx(s.base, className),
    },
    isToolbar ? toolbarProps : {}
  );

  return (
    <Tag {...rootProps} ref={containerRef}>
      {children}
    </Tag>
  );
});

TopBarContainer.displayName = 'TopBar.Container';

export type TopBarContainerProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof TopBarContainer<As>>;
