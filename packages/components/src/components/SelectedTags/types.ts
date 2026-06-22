import type { Key, Node } from '@koobiq/react-core';

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

export type SelectedTagsProps<T extends object> = {
  state: SelectedTagsSelectionState<T>;
  states: {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
  };
  selectedTagsOverflow?: SelectedTagsPropOverflow;
};
