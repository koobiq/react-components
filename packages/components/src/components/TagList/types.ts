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
  /**
   * Whether the collection auto-focuses on mount. `true` / `'first'` focuses
   * the first tag, `'last'` the last tag.
   */
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
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
  };
};

type TagListInheritedProps<T extends object> = TagListCollectionProps<T> &
  TagListKeyboardProps &
  TagListDOMProps;

export type TagListProps<T extends object = object> = ExtendableProps<
  TagListBaseProps,
  TagListInheritedProps<T>
>;

export type TagListComponent = <T extends object = object>(
  props: TagListProps<T>
) => ReactElement | null;

export type TagListRef = ComponentRef<'div'>;
