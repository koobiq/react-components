'use client';

import { useMemo } from 'react';

import { useResizeObserverRefs } from '@koobiq/react-core';
import {
  CollectionBuilder,
  useTagAutocomplete,
  useTagAutocompleteState,
} from '@koobiq/react-primitives';
import type { BaseCollection } from '@koobiq/react-primitives';

import { TagAutocompleteContext } from './TagAutocompleteContext';
import { TagAutocompleteListContext } from './TagAutocompleteListContext';
import type { TagAutocompleteProps } from './types';

export function TagAutocompleteRoot(props: TagAutocompleteProps) {
  const { children } = props;

  return (
    <CollectionBuilder content={children}>
      {(collection: BaseCollection<object>) => (
        <TagAutocompleteInner props={props} collection={collection} />
      )}
    </CollectionBuilder>
  );
}

type TagAutocompleteInnerProps<T extends object> = {
  props: TagAutocompleteProps;
  collection: BaseCollection<T>;
};

function TagAutocompleteInner<T extends object>(
  props: TagAutocompleteInnerProps<T>
) {
  const {
    props: { children, isOpen, defaultOpen, onOpenChange },
    collection,
  } = props;

  const state = useTagAutocompleteState<T>({
    collection,
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const anchorRefs = useMemo(() => [state.anchorRef], [state.anchorRef]);

  const [anchorWidth] = useResizeObserverRefs(
    anchorRefs,
    (element) => element?.offsetWidth ?? 0
  );

  const { listProps, popoverProps } = useTagAutocomplete<T>(state);

  return (
    <TagAutocompleteContext.Provider value={state}>
      <TagAutocompleteListContext.Provider
        value={{ listProps, popoverProps, anchorWidth }}
      >
        {children}
      </TagAutocompleteListContext.Provider>
    </TagAutocompleteContext.Provider>
  );
}
