import type { Ref, ReactElement } from 'react';

import type { AriaTagAutocompleteProps } from '@koobiq/react-primitives';

import type { TagInputProps, TagInputRef } from '../TagInput';

type TagAutocompleteBaseProps<T extends object> = Omit<
  AriaTagAutocompleteProps<T>,
  'description' | 'validate' | 'validationState'
>;

export type TagAutocompleteProps<T extends object = object> =
  TagAutocompleteBaseProps<T> &
    Omit<TagInputProps<T>, keyof AriaTagAutocompleteProps<T> | 'ref'>;

export type TagAutocompleteComponent = <T extends object = object>(
  props: TagAutocompleteProps<T> & { ref?: Ref<TagAutocompleteRef> }
) => ReactElement | null;

export type TagAutocompleteRef = TagInputRef;
