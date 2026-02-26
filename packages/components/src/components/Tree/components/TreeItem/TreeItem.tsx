import type { ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import {
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps,
  type TreeItemContentRenderProps,
  type TreeItemProps as AriaTreeItemProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { AnimatedIcon } from '../../../AnimatedIcon';
import { IconButton } from '../../../IconButton';
import { Checkbox } from '../../Checkbox';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children'> & { children?: ReactNode }
) {
  return (
    <AriaTreeItemContent>
      {({
        selectionBehavior,
        selectionMode,
        isExpanded,
      }: TreeItemContentRenderProps) => (
        <>
          <IconButton slot="chevron" variant="fade-contrast" size="l" isCompact>
            <AnimatedIcon
              icons={[<IconChevronRightS16 key="chevron" />]}
              directions={[0, 90]}
              activeIndex={+isExpanded}
            />
          </IconButton>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox slot="selection" />
          )}
          {props.children}
        </>
      )}
    </AriaTreeItemContent>
  );
}

export interface TreeItemProps extends Partial<AriaTreeItemProps> {
  title: ReactNode;
}

export function TreeItem(props: TreeItemProps) {
  const textValue = typeof props.title === 'string' ? props.title : '';

  return (
    <AriaTreeItem
      textValue={textValue}
      className={clsx('kbq-TreeItem', listItem, textVariant['text-normal'])}
      {...props}
    >
      <TreeItemContent>{props.title}</TreeItemContent>
      {props.children}
    </AriaTreeItem>
  );
}
