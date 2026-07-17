import type { Ref, ReactElement, ReactNode } from 'react';

import type { AriaTagAutocompleteProps } from '@koobiq/react-primitives';

import type { ListInnerProps } from '../List';
import type { PopoverProps } from '../Popover';
import type { TagInputProps, TagInputRef } from '../TagInput';
import type { TagProps } from '../TagList/Tag';

export type TagAutocompleteTagProps<T extends object = object> = TagProps<T>;

type TagAutocompleteBaseProps<T extends object> = Omit<
  AriaTagAutocompleteProps<T>,
  'description' | 'validate' | 'validationState' | 'isClearable'
>;

export type TagAutocompleteProps<T extends object = object> =
  TagAutocompleteBaseProps<T> &
    Omit<
      TagInputProps<T>,
      keyof AriaTagAutocompleteProps<T> | 'ref' | 'slotProps'
    > & {
      /** Whether to show a loading spinner inside the suggestions list. */
      isLoading?: boolean;
      /**
       * Handler called when more suggestions should be loaded, e.g. while
       * scrolling near the bottom of the list.
       */
      onLoadMore?: () => void;
      /** Content shown inside the suggestions list while it is loading. */
      loadingText?: ReactNode;
      /** Content shown when there are no suggestions to display. */
      noItemsText?: ReactNode;
      /** The props used for each slot inside. */
      slotProps?: {
        /** Props for the inner tag input. */
        tagInput?: Partial<Omit<TagInputProps<T>, 'ref'>>;
        /** Props for the suggestions popover. */
        popover?: PopoverProps;
        /** Props for the suggestions list. */
        list?: Omit<ListInnerProps<T>, 'state'>;
      };
    };

export type TagAutocompleteComponent = <T extends object = object>(
  props: TagAutocompleteProps<T> & { ref?: Ref<TagAutocompleteRef> }
) => ReactElement | null;

export type TagAutocompleteRef = TagInputRef;
