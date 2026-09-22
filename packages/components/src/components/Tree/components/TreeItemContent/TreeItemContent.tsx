'use client';

import { useContext } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import { TreeItemContent as AriaTreeItemContent } from '@koobiq/react-primitives';

import { AnimatedIcon } from '../../../AnimatedIcon';
import { Checkbox } from '../../../Checkbox';
import { IconButton } from '../../../IconButton';
import { ListItemContext } from '../../../List/components/ListItemText/ListItemContext';

import type {
  TreeItemContentProps,
  TreeItemContentPropSlotProps,
} from './types';

export function TreeItemContent(props: TreeItemContentProps) {
  const { children, slotProps, ...other } = props;
  const { ref } = useContext(ListItemContext);

  return (
    <AriaTreeItemContent {...other}>
      {(renderProps) => {
        const {
          selectionBehavior,
          selectionMode,
          isDisabled,
          isExpanded,
          isHovered,
        } = renderProps;

        const chevronProps = mergeProps<
          (TreeItemContentPropSlotProps['chevron'] | undefined)[]
        >(
          { variant: 'fade-contrast', size: 'l', isCompact: true, isDisabled },
          slotProps?.chevron
        );

        return (
          <ListItemContext.Provider value={{ ref, isHovered }}>
            <IconButton slot="chevron" data-slot="chevron" {...chevronProps}>
              <AnimatedIcon
                icons={[<IconChevronRightS16 key="chevron" />]}
                directions={[0, 90]}
                activeIndex={+isExpanded}
              />
            </IconButton>
            {selectionBehavior === 'toggle' && selectionMode === 'multiple' && (
              <Checkbox
                data-slot="checkbox"
                slot="selection"
                {...slotProps?.checkbox}
              />
            )}
            {typeof children === 'function' ? children(renderProps) : children}
          </ListItemContext.Provider>
        );
      }}
    </AriaTreeItemContent>
  );
}
