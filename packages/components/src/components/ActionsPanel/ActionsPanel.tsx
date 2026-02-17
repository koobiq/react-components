'use client';

import { Children, cloneElement, useRef } from 'react';
import type { ReactElement } from 'react';

import {
  mergeProps,
  useObjectRef,
  useHideOverflowItems,
  useMultiRef,
} from '@koobiq/react-core';
import {
  useOverlay,
  useToolbar,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import s from './ActionPanel.module.css';
import {
  ActionsPanelAction,
  ActionsPanelCounter,
  ActionsPanelClearButton,
} from './components';
import { ActionsPanelMoreAction } from './components/ActionsPanelMoreAction';
import type { ActionsPanelProps, ActionsPanelActionProps } from './index';

const ActionsPanelComponent = (props: ActionsPanelProps) => {
  const {
    ref,
    isOpen,
    children,
    defaultOpen,
    onOpenChange,
    onClearSelection,
    selectedItemCount,
    disableExitOnEscapeKeyDown,
  } = props;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useObjectRef(ref);
  const { toolbarProps } = useToolbar({ orientation: 'horizontal' }, panelRef);

  const state = useOverlayTriggerState({
    isOpen: isOpen || !!selectedItemCount,
    defaultOpen,
    onOpenChange,
  });

  const { isOpen: isOpenState, close } = state;

  const elements = Children.toArray(children) as Array<
    ReactElement<ActionsPanelActionProps>
  >;

  const { length } = elements;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
    any,
    HTMLDivElement
  >({
    length: length + 2,
    // TODO: calculate this size from the more-action
    busy: 41 + 16,
    deps: [isOpenState],
  });

  const { overlayProps } = useOverlay(
    {
      isOpen: isOpenState,
      onClose: close,
      isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
    },
    overlayRef
  );

  const transitionProps = mergeProps({
    in: isOpenState,
    timeout: 300,
    nodeRef: panelRef,
    unmountOnExit: true,
  });

  const items = elements.map((child, idx) => {
    if (child.type !== ActionsPanelAction) return child;

    return cloneElement(child, {
      ref: itemsRefs[idx],
      'aria-hidden': !visibleMap[idx],
    });
  });

  const rootRef = useMultiRef([parentRef, panelRef, overlayRef]);

  return (
    <Transition {...transitionProps}>
      {(transition) => (
        <div
          ref={rootRef}
          className={s.base}
          data-transition={transition}
          {...mergeProps(toolbarProps, overlayProps)}
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
