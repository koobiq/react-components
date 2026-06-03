import { Tag } from '../TagList/Tag';

import { TagAutocompleteRoot } from './TagAutocomplete';
import { TagAutocompleteListItem } from './TagAutocompleteItem';
import type { TagAutocompleteListItemProps } from './TagAutocompleteItem';
import type {
  TagAutocompleteComponent,
  TagAutocompleteListConfig,
  TagAutocompleteProps,
  TagAutocompleteRef,
} from './types';

type CompoundedComponent = TagAutocompleteComponent & {
  /** Item inside the autocomplete list. */
  ListItem: typeof TagAutocompleteListItem;
  /** Selected tag item. Re-export of `TagInput.Tag`. */
  Tag: typeof Tag;
};

export const TagAutocomplete = TagAutocompleteRoot as CompoundedComponent;

TagAutocomplete.ListItem = TagAutocompleteListItem;
TagAutocomplete.Tag = Tag;

export type {
  TagAutocompleteProps,
  TagAutocompleteRef,
  TagAutocompleteListConfig,
  TagAutocompleteListItemProps,
};
