import type { ReactNode } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import {
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  composeRenderProps,
  type TreeItemContentProps,
  type TreeItemContentRenderProps,
  type TreeItemProps as AriaTreeItemProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { AnimatedIcon } from '../../../AnimatedIcon';
import { Checkbox } from '../../../Checkbox';
import type { CheckboxProps } from '../../../Checkbox';
import { IconButton, type IconButtonProps } from '../../../IconButton';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

type TreeItemContentSlotProps = {
  chevron?: Omit<IconButtonProps, 'slot' | 'children'>;
  selection?: Omit<CheckboxProps, 'slot'>;
};

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children'> & {
    children?: ReactNode;
    slotProps?: TreeItemContentSlotProps;
  }
) {
  const { children, slotProps, ...other } = props;

  const chevronProps = mergeProps<(IconButtonProps | undefined)[]>(
    { variant: 'fade-contrast', size: 'l', isCompact: true },
    slotProps?.chevron
  );

  return (
    <AriaTreeItemContent {...other}>
      {({
        selectionBehavior,
        selectionMode,
        isExpanded,
      }: TreeItemContentRenderProps) => (
        <>
          <IconButton slot="chevron" {...chevronProps}>
            <AnimatedIcon
              icons={[<IconChevronRightS16 key="chevron" />]}
              directions={[0, 90]}
              activeIndex={+isExpanded}
            />
          </IconButton>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox slot="selection" {...slotProps?.selection} />
          )}
          {children}
        </>
      )}
    </AriaTreeItemContent>
  );
}

export type TreeItemProps = Partial<AriaTreeItemProps>;

export function TreeItem({
  children,
  className,
  textValue,
  ...props
}: TreeItemProps) {
  return (
    <AriaTreeItem
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
