import type { Ref, ReactElement } from 'react';

import type { CollectionChildren } from '@koobiq/react-core';
import type { TagAutocompleteFilter } from '@koobiq/react-primitives';

import type { TagInputProps, TagInputRef } from '../TagInput';

export type TagAutocompleteProps<T extends object = object> =
  TagInputProps<T> & {
    /** Tag collection items. */
    listItems?: Iterable<T>;
    /** Render function for each item in the collection. */
    renderListItem: CollectionChildren<T>;
    /** Controlled popover open state. */
    isOpen?: boolean;
    /** Uncontrolled initial popover open state. */
    defaultOpen?: boolean;
    /** Fires whenever the popover open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Filters suggestions by the current input value. */
    defaultFilter?: TagAutocompleteFilter;
  };

export type TagAutocompleteComponent = <T extends object = object>(
  props: TagAutocompleteProps<T> & { ref?: Ref<TagAutocompleteRef> }
) => ReactElement | null;

export type TagAutocompleteRef = TagInputRef;
