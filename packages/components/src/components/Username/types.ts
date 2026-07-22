import type { ComponentPropsWithRef, ReactNode } from 'react';

export const usernamePropMode = ['stacked', 'inline', 'text'] as const;
export type UsernamePropMode = (typeof usernamePropMode)[number];

export const usernamePropType = [
  'default',
  'error',
  'accented',
  'inherit',
] as const;
export type UsernamePropType = (typeof usernamePropType)[number];

export type UsernameUserInfo = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  login?: string;
  site?: string;
};

export type UsernameBaseProps = {
  /** User profile data. Not required when children (custom view) is provided. */
  userInfo?: UsernameUserInfo;
  /**
   * Layout mode.
   * @default 'inline'
   */
  mode?: UsernamePropMode;
  /**
   * Visual color type.
   * @default 'default'
   */
  type?: UsernamePropType;
  /**
   * When true, collapses primary and secondary into a single line.
   * @default false
   */
  isCompact?: boolean;
  /**
   * Format string passed to `formatter`.
   * Interpretation depends on which formatter is used.
   * @default 'lf.m.'
   */
  fullNameFormat?: string;
  /**
   * Function used to format the full name from `userInfo`.
   * Accepts `formatUsername` (default) or `formatUsernameCustom`.
   * Signature: `(userInfo, format) => string`
   */
  formatter?: (
    userInfo: UsernameUserInfo | undefined,
    format: string
  ) => string;
  /** When provided, entirely replaces the auto-rendered template. */
  children?: ReactNode;
  /** Additional CSS classes. */
  className?: string;
};

export type UsernamePrimaryProps = ComponentPropsWithRef<'span'>;
export type UsernameSecondaryProps = ComponentPropsWithRef<'span'>;
export type UsernameSecondaryHintProps = ComponentPropsWithRef<'span'>;
