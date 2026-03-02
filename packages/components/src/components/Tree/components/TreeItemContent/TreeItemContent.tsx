import { mergeProps } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import {
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentRenderProps,
} from '@koobiq/react-primitives';

import { AnimatedIcon } from '../../../AnimatedIcon';
import { Checkbox } from '../../../Checkbox';
import { IconButton } from '../../../IconButton';

import type {
  TreeItemContentProps,
  TreeItemContentPropSlotProps,
} from './types';

export function TreeItemContent(props: TreeItemContentProps) {
  const { children, slotProps, ...other } = props;

  const chevronProps = mergeProps<
    (TreeItemContentPropSlotProps['chevron'] | undefined)[]
  >(
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
