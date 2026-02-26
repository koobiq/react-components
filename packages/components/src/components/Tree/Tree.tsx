'use client';

import { clsx } from '@koobiq/react-core';
import type { TreeProps } from '@koobiq/react-primitives';
import { Tree as AriaTree } from '@koobiq/react-primitives';

import './Tree.css';
import { utilClasses } from '../../styles/utility';

const { list } = utilClasses;

export function Tree<T extends object>(props: TreeProps<T>) {
  return <AriaTree className={clsx('kbq-Tree', list)} {...props} />;
}
