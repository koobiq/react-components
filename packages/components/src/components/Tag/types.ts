import type { ReactNode } from 'react';

export const tagPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagPropVariant = (typeof tagPropVariant)[number];

export type TagBaseProps = {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: TagPropVariant;
  isDisabled?: boolean;
  onCancel?: () => void;
};
