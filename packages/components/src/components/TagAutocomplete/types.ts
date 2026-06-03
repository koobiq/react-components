import type { CSSProperties, ReactNode } from 'react';

import type { AriaListBoxProps } from '@koobiq/react-primitives';

import type { ListInnerProps } from '../List';
import type { PopoverProps } from '../Popover';

export type TagAutocompleteProps = {
  /** The composed children — typically a `TagInput` and a `TagAutocomplete.List`. */
  children: ReactNode;
  /** Controlled popover open state. */
  isOpen?: boolean;
  /** Uncontrolled initial popover open state. */
  defaultOpen?: boolean;
  /** Fires whenever the popover open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
};

export type TagAutocompleteListProps<T extends object = any> = {
  /** Suggestion collection. Render via `children`. */
  items?: Iterable<T>;
  /** Render function for each suggestion. */
  children: AriaListBoxProps<T>['children'];
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
  /** Inline styles for the popover container. */
  style?: CSSProperties;
  /** The props used for each slot inside. */
  slotProps?: {
    popover?: Omit<PopoverProps, 'children'>;
    list?: Omit<ListInnerProps<T>, 'state' | 'children'>;
  };
};
