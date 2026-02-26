import {
  TreeLoadMoreItem as AriaTreeLoadMoreItem,
  type TreeLoadMoreItemProps,
} from '@koobiq/react-primitives';

import { ProgressSpinner } from '../../../ProgressSpinner';

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps) {
  return (
    <AriaTreeLoadMoreItem {...props}>
      <ProgressSpinner isIndeterminate aria-label="Loading more..." />
    </AriaTreeLoadMoreItem>
  );
}
