import type { ComponentRef, ReactElement } from 'react';

import type { AriaTagGroupProps } from '@koobiq/react-primitives';

export type TagGroupPropChildren<T extends object> =
  AriaTagGroupProps<T>['children'];

export type TagGroupPropItems<T extends object> = AriaTagGroupProps<T>['items'];

export type TagGroupPropOnRemove<T extends object> =
  AriaTagGroupProps<T>['onRemove'];

export type TagGroupPropDisabledKeys<T extends object> =
  AriaTagGroupProps<T>['disabledKeys'];

export const tagGroupPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagGroupPropVariant = (typeof tagGroupPropVariant)[number];

export type TagGroupProps<T extends object> = {
  children?: TagGroupPropChildren<T>;
  items?: TagGroupPropItems<T>;
  onRemove?: TagGroupPropOnRemove<T>;
  label?: string | number;
  /**
   * The variant to use.
   * @default theme-fade
   * */
  variant?: TagGroupPropVariant;
  disabledKeys?: TagGroupPropDisabledKeys<T>;
};

export type TagGroupComponentProp = <T extends object>(
  props: TagGroupProps<T>
) => ReactElement | null;

export type TagGroupRef = ComponentRef<'div'>;
