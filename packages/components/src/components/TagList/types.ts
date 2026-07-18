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
  FocusStrategy,
  MultipleSelection,
} from '@koobiq/react-core';
import type { ListState } from '@koobiq/react-primitives';

import type { TagProps } from './Tag';

export type TagListTagProps<T extends object = object> = TagProps<T>;

export const tagListPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagListPropVariant = (typeof tagListPropVariant)[number];

type TagListDOMProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'onChange' | 'onSelect' | 'ref' | 'autoFocus'
>;

type TagListCollectionProps<T extends object> = CollectionBase<T> &
  Omit<MultipleSelection, 'disabledKeys'>;

type TagListKeyboardProps = {
  /**
   * Whether pressing the Escape key should clear selection.
   * @default 'clearSelection'
   */
  escapeKeyBehavior?: 'clearSelection' | 'none';
  /** Focus the first (`true` / `'first'`) or last (`'last'`) tag on mount. */
  autoFocus?: boolean | FocusStrategy;
};

type TagListBaseProps = {
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagListPropVariant;
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
};

type TagListInheritedProps<T extends object> = TagListCollectionProps<T> &
  TagListKeyboardProps &
  TagListDOMProps;

export type TagListProps<T extends object = object> = ExtendableProps<
  TagListBaseProps,
  TagListInheritedProps<T>
>;

export type TagListInnerProps<T extends object = object> = {
  /** Pre-built collection state, e.g. from `useTagListState`. */
  state: ListState<T>;
  /** Whether all tags are disabled by an owning composite component. */
  isDisabled?: boolean;
  /** Ref to the root element. */
  tagListRef?: Ref<HTMLDivElement>;
} & Omit<
  TagListProps<T>,
  // Collection / selection inputs are baked into `state` already.
  | 'ref'
  | 'children'
  | 'items'
  | 'disabledKeys'
  | 'selectionMode'
  | 'disallowEmptySelection'
  | 'selectedKeys'
  | 'defaultSelectedKeys'
  | 'onSelectionChange'
>;

export type TagListComponent = <T extends object = object>(
  props: TagListProps<T>
) => ReactElement | null;

export type TagListRef = ComponentRef<'div'>;
