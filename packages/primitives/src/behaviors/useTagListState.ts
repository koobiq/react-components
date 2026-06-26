import type { ListProps, ListState } from '@react-stately/list';
import { useListState } from '@react-stately/list';

export type AriaTagListStateProps<T extends object> = ListProps<T>;

export type TagListState<T extends object> = ListState<T>;

/** Builds the collection / selection state for a TagList. */
export function useTagListState<T extends object>(
  props: AriaTagListStateProps<T>
): TagListState<T> {
  return useListState(props);
}
