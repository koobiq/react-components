'use client';

import { Children, cloneElement } from 'react';
import type { ReactElement } from 'react';

import {
  mergeProps,
  useObjectRef,
  useHideOverflowItems,
  useMultiRef,
} from '@koobiq/react-core';
import { useToolbar } from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import s from './ActionPanel.module.css';
import {
  ActionsPanelAction,
  ActionsPanelClearButton,
  ActionsPanelCounter,
} from './components';
import { ActionsPanelMoreAction } from './components/ActionsPanelMoreAction';
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
    any,
    HTMLDivElement
  >({
    length: length + 2,
    busy: 41 + 16, // TODO: calculate this size from the more-action
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

  const rootRef = useMultiRef([parentRef, panelRef]);

  return (
    <Transition {...transitionProps}>
      {(transition) => (
        <div
          ref={rootRef}
          className={s.base}
          data-transition={transition}
          {...toolbarProps}
        >
          <div className={s.actions}>
            {items}
            <ActionsPanelCounter
              ref={itemsRefs[length]}
              aria-hidden={!visibleMap[length]}
              selectedItemCount={selectedItemCount}
            />
            <ActionsPanelMoreAction
              ref={itemsRefs[length + 1]}
              aria-hidden={!visibleMap[length + 1]}
            />
            <ActionsPanelClearButton onClearSelection={onClearSelection} />
          </div>
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
