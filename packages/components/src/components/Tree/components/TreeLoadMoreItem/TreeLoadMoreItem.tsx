import type { CSSProperties } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  TreeLoadMoreItem as AriaTreeLoadMoreItem,
  type TreeLoadMoreItemProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { Typography } from '../../../Typography';

const { listItem } = utilClasses;

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps) {
  return (
    <AriaTreeLoadMoreItem
      {...props}
      className={clsx('kbq-TreeLoadMoreItem', listItem)}
      style={({ level }) => ({ '--tree-item-level': level }) as CSSProperties}
    >
      <ProgressSpinner isIndeterminate aria-label="Loading more..." />
      <Typography>Loading more...</Typography>
    </AriaTreeLoadMoreItem>
  );
}
