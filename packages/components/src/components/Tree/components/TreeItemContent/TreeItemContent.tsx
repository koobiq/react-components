'use client';

import { mergeProps } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import { TreeItemContent as AriaTreeItemContent } from '@koobiq/react-primitives';

import { AnimatedIcon } from '../../../AnimatedIcon';
import { Checkbox } from '../../../Checkbox';
import { IconButton } from '../../../IconButton';

import type {
  TreeItemContentProps,
  TreeItemContentPropSlotProps,
} from './types';

export function TreeItemContent(props: TreeItemContentProps) {
  const { children, slotProps, ...other } = props;

  return (
    <AriaTreeItemContent {...other}>
      {(renderProps) => {
        const { selectionBehavior, selectionMode, isDisabled, isExpanded } =
          renderProps;

        const chevronProps = mergeProps<
          (TreeItemContentPropSlotProps['chevron'] | undefined)[]
        >(
          { variant: 'fade-contrast', size: 'l', isCompact: true, isDisabled },
          slotProps?.chevron
        );

        return (
          <>
            <IconButton slot="chevron" data-slot="chevron" {...chevronProps}>
              <AnimatedIcon
                icons={[<IconChevronRightS16 key="chevron" />]}
                directions={[0, 90]}
                activeIndex={+isExpanded}
              />
            </IconButton>
            {selectionBehavior === 'toggle' && selectionMode === 'multiple' && (
              <Checkbox slot="selection" {...slotProps?.checkbox} />
            )}
            {typeof children === 'function' ? children(renderProps) : children}
          </>
        );
      }}
    </AriaTreeItemContent>
  );
}
