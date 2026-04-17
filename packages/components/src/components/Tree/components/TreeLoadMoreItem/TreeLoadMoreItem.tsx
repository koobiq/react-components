'use client';

import type { CSSProperties, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  TreeLoadMoreItem as AriaTreeLoadMoreItem,
  composeRenderProps,
  type TreeLoadMoreItemProps as AriaTreeLoadMoreItemProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { isPrimitiveNode } from '../../../../utils';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { Typography } from '../../../Typography';

const { listItem } = utilClasses;

export type TreeLoadMoreItemProps = Omit<
  AriaTreeLoadMoreItemProps,
  'children'
> & { children?: ReactNode };

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps) {
  const { className, style, children = 'Loading more...', ...other } = props;

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
      {isPrimitiveNode(children) ? (
        <>
          <ProgressSpinner isIndeterminate aria-label={String(children)} />
          <Typography>{children}</Typography>
        </>
      ) : (
        children
      )}
    </AriaTreeLoadMoreItem>
  );
}
