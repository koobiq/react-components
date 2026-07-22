'use client';

import {
  forwardRef,
  type ComponentPropsWithRef,
  type ComponentRef,
} from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';

import type { UsernameBaseProps } from './types';
import s from './Username.module.css';
import { UsernamePrimary } from './UsernamePrimary';
import { UsernameSecondary } from './UsernameSecondary';
import { UsernameSecondaryHint } from './UsernameSecondaryHint';
import { formatUsername } from './utils';

/**
 * Displays a user's name based on profile data.
 * Supports different layout modes and visual styles.
 * Provide `children` to take full control of the rendered content.
 */
export const Username = forwardRef<ComponentRef<'span'>, UsernameBaseProps>(
  (props, ref) => {
    const {
      userInfo,
      mode = 'inline',
      type = 'default',
      isCompact = false,
      fullNameFormat = 'lf.m.',
      formatter = formatUsername,
      children,
      className,
      ...other
    } = props;

    const rootClassName = clsx(s.base, s[mode], s[type], className);

    const rootProps = {
      'data-mode': mode,
      'data-type': type,
      className: rootClassName,
      ref,
      ...other,
    };

    // When children are provided, render as a custom view (overrides default template).
    if (isNotNil(children)) {
      return (
        <span data-compact={isCompact || undefined} {...rootProps}>
          {children}
        </span>
      );
    }

    const hasFullName = Boolean(userInfo?.firstName && userInfo?.lastName);
    const name = hasFullName ? formatter(userInfo, fullNameFormat) : '';

    if (isCompact) {
      return (
        <span data-compact {...rootProps}>
          <UsernamePrimary>
            {hasFullName ? name : userInfo?.login}
            {isNotNil(userInfo?.site) && (
              <UsernameSecondaryHint> ({userInfo!.site})</UsernameSecondaryHint>
            )}
          </UsernamePrimary>
        </span>
      );
    }

    return (
      <span {...rootProps}>
        {hasFullName && <UsernamePrimary>{name}</UsernamePrimary>}
        {isNotNil(userInfo?.login) && (
          <UsernameSecondary>
            {userInfo!.login}
            {isNotNil(userInfo?.site) && (
              <UsernameSecondaryHint> ({userInfo!.site})</UsernameSecondaryHint>
            )}
          </UsernameSecondary>
        )}
      </span>
    );
  }
);

Username.displayName = 'Username';

export type UsernameProps = ComponentPropsWithRef<typeof Username>;
