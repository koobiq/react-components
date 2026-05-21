import type { ListProps, ListState } from '@koobiq/react-primitives';
import { useListState } from '@koobiq/react-primitives';

export type AriaTagListStateProps<T extends object> = ListProps<T>;

export type TagListState<T extends object> = ListState<T>;

/** Builds the collection / selection state for a `TagList`. */
export function useTagListState<T extends object>(
  props: AriaTagListStateProps<T>
): TagListState<T> {
  return useListState(props);
}
