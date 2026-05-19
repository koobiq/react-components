import type {
  Ref,
  ReactElement,
  ComponentRef,
  CSSProperties,
  ComponentPropsWithRef,
} from 'react';

import type {
  Key,
  CollectionBase,
  ExtendableProps,
  MultipleSelection,
} from '@koobiq/react-core';

export const tagGroupNextPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagGroupNextPropVariant = (typeof tagGroupNextPropVariant)[number];

type TagGroupNextDOMProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'onChange' | 'onSelect' | 'ref'
>;

type TagGroupNextCollectionProps<T extends object> = CollectionBase<T> &
  Omit<MultipleSelection, 'disabledKeys'>;

type TagGroupNextKeyboardProps = {
  /**
   * Whether pressing the Escape key should clear selection.
   * @default 'clearSelection'
   */
  escapeKeyBehavior?: 'clearSelection' | 'none';
};

type TagGroupNextOwnProps = {
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagGroupNextPropVariant;
  /** Ref to the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Inline styles. */
  style?: CSSProperties;
  /** Handler that is called when a user deletes a tag. */
  onRemove?: (keys: Set<Key>) => void;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
  };
};

type TagGroupNextInheritedProps<T extends object> =
  TagGroupNextCollectionProps<T> &
    TagGroupNextKeyboardProps &
    TagGroupNextDOMProps;

export type TagGroupNextProps<T extends object = object> = ExtendableProps<
  TagGroupNextOwnProps,
  TagGroupNextInheritedProps<T>
>;

export type TagGroupNextComponent = <T extends object = object>(
  props: TagGroupNextProps<T>
) => ReactElement | null;

export type TagGroupNextRef = ComponentRef<'div'>;
