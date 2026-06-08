import type { Ref, ReactElement, ReactNode } from 'react';

import type { AriaTagAutocompleteProps } from '@koobiq/react-primitives';

import type { TagInputProps, TagInputRef } from '../TagInput';

type TagAutocompleteBaseProps<T extends object> = Omit<
  AriaTagAutocompleteProps<T>,
  'description' | 'validate' | 'validationState'
>;

export type TagAutocompleteProps<T extends object = object> =
  TagAutocompleteBaseProps<T> &
    Omit<TagInputProps<T>, keyof AriaTagAutocompleteProps<T> | 'ref'> & {
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
    };

export type TagAutocompleteComponent = <T extends object = object>(
  props: TagAutocompleteProps<T> & { ref?: Ref<TagAutocompleteRef> }
) => ReactElement | null;

export type TagAutocompleteRef = TagInputRef;
