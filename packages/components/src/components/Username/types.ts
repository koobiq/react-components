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

export type UsernameBaseProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> & {
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
   * Defaults to `formatUsername`. To use a different format style, wrap
   * `formatUsername` with its `UsernameFormatOptions` (e.g. `mapping`,
   * `caseDeterminesForm`) bound.
   * Signature: `(userInfo, format) => string`
   */
  formatter?: (
    userInfo: UsernameUserInfo | undefined,
    format: string
  ) => string;
  /** When provided, entirely replaces the auto-rendered template. */
  children?: ReactNode;
};

export type UsernamePrimaryProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> & {
  /** Primary line content. Usually the formatted full name, or the login when no name is available. */
  children?: ReactNode;
};

export type UsernameSecondaryProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> & {
  /** Secondary line content. Usually the login. */
  children?: ReactNode;
};

export type UsernameSecondaryHintProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> & {
  /** Hint content appended after the secondary line. Usually the site. */
  children?: ReactNode;
};
