'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';

import s from './TopBarTitle.module.css';
import type { TopBarTitleBaseProps } from './types';

const { title } = utilClasses.typography;

/** TopBar.Title is the page heading shown on the start side of the top bar. */
export const TopBarTitle = polymorphicForwardRef<'h1', TopBarTitleBaseProps>(
  (props, ref) => {
    const { as: Tag = 'h1', className, children, ...other } = props;

    return (
      <Tag className={clsx(s.base, title, className)} {...other} ref={ref}>
        {children}
      </Tag>
    );
  }
);

TopBarTitle.displayName = 'TopBar.Title';

export type TopBarTitleProps<As extends ElementType = 'h1'> =
  ComponentPropsWithRef<typeof TopBarTitle<As>>;
