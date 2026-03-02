import type { CSSProperties } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  TreeLoadMoreItem as AriaTreeLoadMoreItem,
  composeRenderProps,
  type TreeLoadMoreItemProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { Typography } from '../../../Typography';

const { listItem } = utilClasses;

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps) {
  const { className, style, ...other } = props;

  return (
    <AriaTreeLoadMoreItem
      {...other}
      className={composeRenderProps(className, (className) =>
        clsx('kbq-TreeLoadMoreItem', listItem, className)
      )}
      style={composeRenderProps(
        style,
        (style, { level }) =>
          ({
            '--tree-item-level': level,
            ...style,
          }) as CSSProperties
      )}
    >
      <ProgressSpinner isIndeterminate aria-label="Loading more..." />
      <Typography>Loading more...</Typography>
    </AriaTreeLoadMoreItem>
  );
}
