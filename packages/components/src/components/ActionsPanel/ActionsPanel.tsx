'use client';

import { mergeProps, useObjectRef } from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';
import { useToolbar } from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { Button } from '../Button';
import { Divider } from '../Divider';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Typography } from '../Typography';

import s from './ActionPanel.module.css';
import { ActionsPanelAction } from './components';
import type { ActionsPanelProps } from './type';

const ActionsPanelComponent = (props: ActionsPanelProps) => {
  const { children, selectedItemCount, onClearSelection, ref } = props;
  const panelRef = useObjectRef(ref);
  const { toolbarProps } = useToolbar({ orientation: 'horizontal' }, panelRef);

  const transitionProps = mergeProps({
    timeout: 300,
    in: !!selectedItemCount,
    nodeRef: panelRef,
    unmountOnExit: true,
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
          <FlexBox gap="xs">{children}</FlexBox>
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
