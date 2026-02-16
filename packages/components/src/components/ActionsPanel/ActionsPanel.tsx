'use client';

import { Children, cloneElement } from 'react';
import type { ReactElement } from 'react';

import {
  mergeProps,
  useObjectRef,
  useHideOverflowItems,
} from '@koobiq/react-core';
import { IconCircleXmark16, IconEllipsisVertical16 } from '@koobiq/react-icons';
import { useToolbar } from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { Button } from '../Button';
import { Divider } from '../Divider';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Typography } from '../Typography';

import s from './ActionPanel.module.css';
import { ActionsPanelAction } from './components';
import type { ActionsPanelProps, ActionsPanelActionProps } from './index';

const ActionsPanelComponent = (props: ActionsPanelProps) => {
  const { children, selectedItemCount, onClearSelection, ref } = props;
  const panelRef = useObjectRef(ref);
  const { toolbarProps } = useToolbar({ orientation: 'horizontal' }, panelRef);

  const elements = Children.toArray(children) as Array<
    ReactElement<ActionsPanelActionProps>
  >;

  const { length } = elements;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
    HTMLButtonElement,
    HTMLDivElement
  >({
    length: length + 1,
    deps: [!!selectedItemCount],
  });

  const transitionProps = mergeProps({
    timeout: 300,
    nodeRef: panelRef,
    unmountOnExit: true,
    in: !!selectedItemCount,
  });

  const items = elements.map((child, idx) => {
    if (child.type !== ActionsPanelAction) return child;

    return cloneElement(child, {
      ref: itemsRefs[idx],
      'aria-hidden': !visibleMap[idx],
    });
  });

  return (
    <Transition {...transitionProps}>
      {(transition) => (
        <div
          ref={panelRef}
          className={s.base}
          data-transition={transition}
          {...toolbarProps}
        >
          <FlexBox alignItems="center">
            <Typography
              color="on-contrast"
              variant="text-normal-medium"
              className={spacing({ pi: 'm', pb: 'xs' })}
            >
              Selected:&nbsp;{selectedItemCount}
            </Typography>
            <Divider orientation="vertical" className={s.divider} />
          </FlexBox>
          <div className={s.actions} ref={parentRef}>
            {items}
            <ActionsPanelAction
              ref={itemsRefs[length]}
              startIcon={<IconEllipsisVertical16 />}
              aria-hidden={!visibleMap[length]}
              onlyIcon
            />
          </div>
          <FlexBox alignItems="center">
            <Divider orientation="vertical" className={s.divider} />
            <Button
              onPress={onClearSelection}
              startIcon={<IconCircleXmark16 />}
              onlyIcon
            />
          </FlexBox>
        </div>
      )}
    </Transition>
  );
};

ActionsPanelComponent.displayName = 'ActionsPanel';

type CompoundedComponent = typeof ActionsPanelComponent & {
  Action: typeof ActionsPanelAction;
};

export const ActionsPanel = ActionsPanelComponent as CompoundedComponent;

ActionsPanel.Action = ActionsPanelAction;
