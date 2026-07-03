import type { ReactNode } from 'react';

import type { Key, Node } from '@koobiq/react-core';

import type { TagProps } from '../Tag';

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
export type SelectedTagsRenderTagProps = Omit<TagProps, 'children'> & {
  'aria-hidden'?: true;
  variant: NonNullable<TagProps['variant']>;
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
