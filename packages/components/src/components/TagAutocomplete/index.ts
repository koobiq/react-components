import type { ReactElement } from 'react';

import { Tag } from '../TagList/Tag';

import { TagAutocompleteRoot } from './TagAutocomplete';
import { TagAutocompleteItem } from './TagAutocompleteItem';
import type { TagAutocompleteItemProps } from './TagAutocompleteItem';
import { TagAutocompleteList } from './TagAutocompleteList';
import type { TagAutocompleteListProps, TagAutocompleteProps } from './types';

type TagAutocompleteComponent = (<T extends object = any>(
  props: TagAutocompleteProps<T>
) => ReactElement) & {
  /** Popover with the suggestion listbox. */
  List: typeof TagAutocompleteList;
  /** Item inside `TagAutocomplete.List`. */
  Item: typeof TagAutocompleteItem;
  /** Tag inside the nested `TagInput`. Re-export of `TagInput.Tag`. */
  Tag: typeof Tag;
};

export const TagAutocomplete = TagAutocompleteRoot as TagAutocompleteComponent;

TagAutocomplete.List = TagAutocompleteList;
TagAutocomplete.Item = TagAutocompleteItem;
TagAutocomplete.Tag = Tag;

export type {
  TagAutocompleteProps,
  TagAutocompleteListProps,
  TagAutocompleteItemProps,
};
