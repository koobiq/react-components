import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type {
  AriaListBoxProps,
  TagAutocompleteFilter,
} from '@koobiq/react-primitives';

import type { ListInnerProps } from '../List';
import type { PopoverProps } from '../Popover';
import type { TagInputProps, TagInputRef } from '../TagInput';

export type TagAutocompleteListConfig<T extends object = object> = {
  /** Suggestion collection rendered via `renderItem`. */
  items?: Iterable<T>;
  /** Render function for each suggestion. */
  renderItem: AriaListBoxProps<T>['children'];
  /** Filters suggestions by the current input value. */
  defaultFilter?: TagAutocompleteFilter;
  /** Content to display when no suggestions are available. */
  noItemsText?: ReactNode;
  /** Whether a load-more spinner should be shown. */
  isLoading?: boolean;
  /** Fires when the listbox is scrolled near the bottom. */
  onLoadMore?: () => void;
  /** Content to display while items are loading. */
  loadingText?: ReactNode;
  /** Additional CSS-classes for the popover container. */
  className?: string;
  /** Inline styles for the suggestion list. */
  style?: CSSProperties;
  /** The props used for each slot inside. */
  slotProps?: {
    popover?: Omit<PopoverProps, 'children'>;
    list?: Omit<ListInnerProps<T>, 'state' | 'children' | 'listRef'>;
  };
};

export type TagAutocompleteProps<T extends object = object> =
  TagInputProps<T> & {
    /** Autocomplete list configuration. */
    list: TagAutocompleteListConfig<T>;
    /** Controlled popover open state. */
    isOpen?: boolean;
    /** Uncontrolled initial popover open state. */
    defaultOpen?: boolean;
    /** Fires whenever the popover open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
  };

export type TagAutocompleteComponent = <T extends object = object>(
  props: TagAutocompleteProps<T> & { ref?: Ref<TagAutocompleteRef> }
) => ReactElement | null;

export type TagAutocompleteRef = TagInputRef;
