'use client';

import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  TreeItem as AriaTreeItem,
  composeRenderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { ListItemContext } from '../../../List/components/ListItemText/ListItemContext';

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
  const ref = useRef<HTMLDivElement>(null);

  return (
    // `Tree.ItemContent` adds the hover state it gets from React Aria.
    <ListItemContext.Provider value={{ ref }}>
      <AriaTreeItem
        data-align={align}
        {...props}
        ref={ref}
        textValue={textValue ?? ''}
        className={composeRenderProps(className, (className) =>
          clsx('kbq-TreeItem', listItem, textVariant['text-normal'], className)
        )}
      >
        {children}
      </AriaTreeItem>
    </ListItemContext.Provider>
  );
}
