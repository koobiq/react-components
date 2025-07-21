import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

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
  /** The contents of the collection. */
  children?: TagGroupPropChildren<T>;
  /** Item objects in the collection. */
  items?: TagGroupPropItems<T>;
  /** Handler that is called when a user deletes a tag.  */
  onRemove?: TagGroupPropOnRemove<T>;
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagGroupPropVariant;
  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: TagGroupPropDisabledKeys<T>;
  /** Ref to the HTML ul-element. */
  ref?: Ref<HTMLElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Inline styles. */
  style?: CSSProperties;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
  };
};

export type TagGroupComponent = <T extends object>(
  props: TagGroupProps<T>
) => ReactElement | null;

export type TagGroupRef = ComponentRef<'div'>;
