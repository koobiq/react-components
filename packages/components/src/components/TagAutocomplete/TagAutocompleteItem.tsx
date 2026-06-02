'use client';

import type { ForwardedRef } from 'react';

import { ItemNode, createLeafComponent } from '@koobiq/react-primitives';

import type { ItemProps } from '../Collections';

export type TagAutocompleteItemProps<T extends object = object> = ItemProps<T>;

export const TagAutocompleteItem = createLeafComponent(
  ItemNode,
  function TagAutocompleteItem<T extends object>(
    props: TagAutocompleteItemProps<T>,
    ref: ForwardedRef<HTMLElement>
  ) {
    void props;
    void ref;

    return null;
  }
);
