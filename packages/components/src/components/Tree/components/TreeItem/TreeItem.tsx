'use client';

import { clsx } from '@koobiq/react-core';
import {
  TreeItem as AriaTreeItem,
  composeRenderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

import type { TreeItemProps } from './types';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

export function TreeItem({
  children,
  className,
  textValue,
  align = 'center',
  ...props
}: TreeItemProps) {
  return (
    <AriaTreeItem
      data-align={align}
      {...props}
      textValue={textValue ?? ''}
      className={composeRenderProps(className, (className) =>
        clsx('kbq-TreeItem', listItem, textVariant['text-normal'], className)
      )}
    >
      {children}
    </AriaTreeItem>
  );
}
