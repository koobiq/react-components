'use client';

import { Children, cloneElement, useRef } from 'react';
import type { ReactElement } from 'react';

import {
  mergeProps,
  useMultiRef,
  useObjectRef,
  useElementSize,
  useHideOverflowItems,
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
import type {
  ActionsPanelProps,
  ActionsPanelActionProps,
  ActionsPanelActionRenderItem,
} from './index';

const ActionsPanelComponent = (props: ActionsPanelProps) => {
  const {
    ref,
    children,
    onAction,
    onClearSelection,
    selectedItemCount,
    disableExitOnEscapeKeyDown,
  } = props;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useObjectRef(ref);

  const { toolbarProps } = useToolbar({ orientation: 'horizontal' }, panelRef);
  const { ref: clearBtnRef, width: clearBtnWidth } = useElementSize();

  const state = useOverlayTriggerState({
    isOpen: !!selectedItemCount,
  });

  const { isOpen: isOpenState, close } = state;

  const elements: Array<ReactElement<ActionsPanelActionProps>> = [];
  const elementKeys: Array<string | null> = [];

  Children.forEach(children, (child) => {
    if (!child || typeof child !== 'object') return;
    const el = child as ReactElement<ActionsPanelActionProps>;
    elements.push(el);
    elementKeys.push(el.key);
  });

  const { length } = elements;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
    any,
    HTMLDivElement
  >({
    length: length + 2,
    minHiddenForMore: 2,
    // TODO: calculate this size from the more-action
    busy: clearBtnWidth + 16,
    deps: [isOpenState, clearBtnWidth],
  });

  const counterIndex = length;
  const moreIndex = length + 1;

  const { overlayProps } = useOverlay(
    {
      onClose: close,
      isOpen: isOpenState,
      isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
    },
    overlayRef
  );

  const transitionProps = mergeProps({
    timeout: 300,
    in: isOpenState,
    nodeRef: panelRef,
    unmountOnExit: true,
  });

  const items: Array<ReactElement<ActionsPanelActionProps>> = [];
  const collapsedItems: ActionsPanelActionRenderItem[] = [];

  for (let idx = 0; idx < elements.length; idx += 1) {
    const element = elements[idx];
    const isAction = element.type === ActionsPanelAction;
    const isHidden = !visibleMap[idx];

    if (!isAction) {
      items.push(element);
    } else {
      const itemKey = elementKeys[idx] ?? String(idx);

      if (isHidden) {
        collapsedItems.push({
          element,
          index: idx,
          key: itemKey,
          props: element.props,
          children: element.props.children,
        });
      }

      items.push(
        cloneElement(element, {
          ref: itemsRefs[idx],
          'aria-hidden': isHidden || undefined,
          onPress: (e) => {
            element.props?.onPress?.(e);
            onAction?.(itemKey);
          },
        })
      );
    }
  }

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
              ref={itemsRefs[counterIndex]}
              selectedItemCount={selectedItemCount}
              aria-hidden={!visibleMap[counterIndex]}
            />

            <ActionsPanelMoreAction
              onAction={onAction}
              ref={itemsRefs[moreIndex]}
              collapsedItems={collapsedItems}
              selectedItemCount={selectedItemCount}
              aria-hidden={!visibleMap[moreIndex]}
            />

            <ActionsPanelClearButton
              ref={clearBtnRef}
              onClearSelection={onClearSelection}
            />
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
