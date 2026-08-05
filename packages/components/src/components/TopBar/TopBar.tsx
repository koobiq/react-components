'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { TopBarContainer, TopBarTitle } from './components';
import s from './TopBar.module.css';
import type { TopBarBaseProps } from './types';

const TopBarComponent = polymorphicForwardRef<'header', TopBarBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'header',
      position = 'sticky',
      hasShadow = false,
      className,
      children,
      ...other
    } = props;

    return (
      <Tag
        {...other}
        data-position={position}
        data-shadow={hasShadow || undefined}
        className={clsx(s.base, className)}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

TopBarComponent.displayName = 'TopBar';

/**
 * TopBar is the bar at the top of a page. It holds the page title or the
 * breadcrumbs on the start side and the page actions on the end side.
 */
export const TopBar = Object.assign(TopBarComponent, {
  Container: TopBarContainer,
  Title: TopBarTitle,
});

export type TopBarProps<As extends ElementType = 'header'> =
  ComponentPropsWithRef<typeof TopBar<As>>;
