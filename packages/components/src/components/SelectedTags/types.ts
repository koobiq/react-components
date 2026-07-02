import type { ComponentRef, ReactNode, Ref } from 'react';

import type { Key, Node } from '@koobiq/react-core';

import type { TagGroupPropVariant } from '../TagGroup';

export const selectedTagsPropOverflow = ['multiline', 'responsive'] as const;

export type SelectedTagsPropOverflow =
  (typeof selectedTagsPropOverflow)[number];

/** Minimal selection state the tags read; any selection state fits structurally. */
export interface SelectedTagsSelectionState<T extends object> {
  selectedItems: Node<T>[] | null;
  selectionManager: {
    isSelected: (key: Key) => boolean;
    toggleSelection: (key: Key) => void;
  };
}

/** Props to spread onto a custom tag's root element; returned by the `renderTag` callback. */
export type SelectedTagsRenderTagProps = {
  ref?: Ref<ComponentRef<'div'>>;
  className?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  'aria-hidden'?: true;
  variant: TagGroupPropVariant;
  onRemove: () => void;
};

export type SelectedTagsProps<T extends object> = {
  state: SelectedTagsSelectionState<T>;
  states: {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
  };
  selectedTagsOverflow?: SelectedTagsPropOverflow;
  renderTag?: (
    item: Node<T>,
    tagProps: SelectedTagsRenderTagProps
  ) => ReactNode;
};
