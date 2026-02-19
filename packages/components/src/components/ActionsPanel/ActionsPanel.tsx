'use client';

import { Children, cloneElement, useRef, useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import {
  mergeProps,
  useMultiRef,
  useElementSize,
  useHideOverflowItems,
} from '@koobiq/react-core';
import {
  Overlay,
  useOverlay,
  useToolbar,
  useOverlayTriggerState,
  useContextProps,
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
import { ActionsPanelContext } from './index';

const ActionsPanelComponent = (props: ActionsPanelProps) => {
  const [panelProps, panelRef] = useContextProps(
    props,
    props.ref,
    ActionsPanelContext
  );

  const {
    children,
    onAction,
    onClearSelection,
    selectedItemCount,
    selectedExtraCount,
    portalContainer,
    disableExitOnEscapeKeyDown,
    ...other
  } = panelProps;

  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Preserve count during close animation
  const [shownCount, setShownCount] = useState(selectedItemCount);

  const { toolbarProps } = useToolbar({ orientation: 'horizontal' }, panelRef);
  const { ref: clearBtnRef, width: clearBtnWidth } = useElementSize();

  const state = useOverlayTriggerState({
    isOpen: !!selectedItemCount,
    onOpenChange: onClearSelection,
  });

  const { isOpen: isOpenState, close } = state;

  useEffect(() => {
    if (isOpenState) {
      setShownCount(selectedItemCount);
    }
  }, [isOpenState, selectedItemCount]);

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
    busy: clearBtnWidth,
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

  const rootProps = mergeProps(
    { className: s.base },
    other,
    toolbarProps,
    overlayProps
  );

  return (
    <Transition {...transitionProps}>
      {(transition) => (
        <Overlay portalContainer={portalContainer || undefined}>
          <div data-transition={transition} {...rootProps} ref={rootRef}>
            <div className={s.actions}>
              {items}
              <ActionsPanelCounter
                ref={itemsRefs[counterIndex]}
                selectedItemCount={shownCount}
                selectedExtraCount={selectedExtraCount}
                aria-hidden={!visibleMap[counterIndex]}
              />
              <ActionsPanelMoreAction
                onAction={onAction}
                ref={itemsRefs[moreIndex]}
                selectedItemCount={shownCount}
                selectedExtraCount={selectedExtraCount}
                collapsedItems={collapsedItems}
                aria-hidden={!visibleMap[moreIndex]}
              />
              <ActionsPanelClearButton
                ref={clearBtnRef}
                onClearSelection={onClearSelection}
              />
            </div>
          </div>
        </Overlay>
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
