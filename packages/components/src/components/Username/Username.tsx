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
const UsernameComponent = forwardRef<ComponentRef<'span'>, UsernameBaseProps>(
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

    const rootProps = {
      'data-mode': mode,
      'data-type': type,
      'data-compact': isCompact || undefined,
      className: clsx(s.base, s[mode], s[type], className),
      ref,
      ...other,
    };

    if (isNotNil(children)) {
      return <span {...rootProps}>{children}</span>;
    }

    const hasFullName = Boolean(userInfo?.firstName && userInfo?.lastName);
    const name = hasFullName ? formatter(userInfo, fullNameFormat) : '';
    const primaryText = hasFullName ? name : userInfo?.login;

    const secondaryText =
      !isCompact && hasFullName ? userInfo?.login : undefined;

    const showSiteInSecondary = isNotNil(userInfo?.site && secondaryText);

    const primaryHoldsLogin = isCompact
      ? isNotNil(primaryText)
      : isNotNil(userInfo?.login) && !hasFullName;

    const showSiteInPrimary =
      isNotNil(userInfo?.site) && !showSiteInSecondary && primaryHoldsLogin;

    const hint = userInfo?.site ? (
      <UsernameSecondaryHint> ({userInfo.site})</UsernameSecondaryHint>
    ) : null;

    return (
      <span {...rootProps}>
        {primaryText && (
          <UsernamePrimary>
            {primaryText}
            {showSiteInPrimary && hint}
          </UsernamePrimary>
        )}
        {secondaryText && (
          <UsernameSecondary>
            {secondaryText}
            {showSiteInSecondary && hint}
          </UsernameSecondary>
        )}
      </span>
    );
  }
);

UsernameComponent.displayName = 'Username';

type CompoundedComponent = typeof UsernameComponent & {
  Primary: typeof UsernamePrimary;
  Secondary: typeof UsernameSecondary;
  SecondaryHint: typeof UsernameSecondaryHint;
};

export const Username = UsernameComponent as CompoundedComponent;

Username.Primary = UsernamePrimary;
Username.Secondary = UsernameSecondary;
Username.SecondaryHint = UsernameSecondaryHint;

export type UsernameProps = ComponentPropsWithRef<typeof UsernameComponent>;
