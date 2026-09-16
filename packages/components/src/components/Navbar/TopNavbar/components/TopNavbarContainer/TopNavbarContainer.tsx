'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './TopNavbarContainer.module.css';

export const topNavbarContainerPropPlacement = ['start', 'end'] as const;

export type TopNavbarContainerPropPlacement =
  (typeof topNavbarContainerPropPlacement)[number];

export type TopNavbarContainerProps = {
  /**
   * The side of the navbar the container is placed on.
   * @default 'start'
   */
  placement?: TopNavbarContainerPropPlacement;
  /** Additional CSS-classes. */
  className?: string;
  /** The items of the container, e.g. `TopNavbar.Item`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'div'>;

export const TopNavbarContainer = ({
  placement = 'start',
  className,
  children,
  ...props
}: TopNavbarContainerProps) => (
  <div
    data-placement={placement}
    className={clsx(s.base, className)}
    {...props}
  >
    {children}
  </div>
);

TopNavbarContainer.displayName = 'TopNavbar.Container';
