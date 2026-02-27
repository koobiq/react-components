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
import { Checkbox } from '../../../Checkbox';
import { IconButton } from '../../../IconButton';

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

export type TreeItemProps = Partial<AriaTreeItemProps>;

export function TreeItem(props: TreeItemProps) {
  return (
    <AriaTreeItem
      textValue={props.textValue ?? ''}
      className={clsx('kbq-TreeItem', listItem, textVariant['text-normal'])}
      {...props}
    >
      {props.children}
    </AriaTreeItem>
  );
}
