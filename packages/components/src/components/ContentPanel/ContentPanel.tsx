'use client';

import type {
  CSSProperties,
  HTMLAttributes,
  ComponentPropsWithRef,
} from 'react';
import { forwardRef, useContext, useRef } from 'react';

import { useDOMRef, mergeProps, clsx } from '@koobiq/react-core';
import {
  useOverlay,
  useContextProps,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from '../Dialog';
import type { DialogProps } from '../Dialog';
import { Resizable } from '../Resizable';

import { ContentPanelContainerContext } from './components';
import { TRANSITION_TIMEOUT } from './constants';
import s from './ContentPanel.module.css';
import { ContentPanelContext } from './ContentPanelContext';
import { useContentPanelResize } from './hooks';
import type { ContentPanelProps, ContentPanelRef } from './types';

const ContentPanelComponent = forwardRef<ContentPanelRef, ContentPanelProps>(
  (props, ref) => {
    const domRef = useDOMRef<HTMLDivElement>(ref);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const [panelProps, panelRef] = useContextProps(
      props,
      domRef,
      ContentPanelContext
    );

    const {
      defaultWidth,
      disableExitOnEscapeKeyDown,
      minWidth,
      maxWidth,
      isResizable = false,
      hideCloseButton,
      onResizeStart,
      onResetResize,
      onOpenChange,
      defaultOpen,
      onResizeEnd,
      slotProps,
      className,
      children,
      onResize,
      isOpen,
      width,
      style,
      ...other
    } = panelProps;

    const {
      portalContainer,
      containerWidth,
      state: containerState,
    } = useContext(ContentPanelContainerContext);

    const componentState = useOverlayTriggerState({
      isOpen,
      onOpenChange,
      defaultOpen,
    });

    const state = containerState ?? componentState;

    const { isOpen: isOpenState, close } = state;

    const { resizableProps, handleProps } = useContentPanelResize({
      width,
      isResizable,
      minWidth,
      maxWidth,
      containerWidth,
      onResize,
      onResizeEnd,
      onResizeStart,
      onResetResize,
      defaultWidth,
    });

    const { overlayProps } = useOverlay(
      {
        onClose: close,
        isOpen: isOpenState,
        isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
      },
      overlayRef
    );

    const rootProps = mergeProps<ComponentPropsWithRef<'div'>[]>(
      {
        ref: panelRef,
        className: clsx(s.base, className),
        style: {
          '--content-panel-transition-duration': `${TRANSITION_TIMEOUT}ms`,
          ...style,
        } as CSSProperties,
      },
      other
    );

    const dialogProps = mergeProps<
      (DialogProps | undefined | HTMLAttributes<HTMLElement>)[]
    >(
      {
        onClose: close,
        className: s.dialog,
        hideCloseButton,
      },
      slotProps?.dialog,
      overlayProps
    );

    const resizerProps = mergeProps(handleProps, slotProps?.resizer);

    const transitionProps = mergeProps(
      {
        timeout: TRANSITION_TIMEOUT,
        in: isOpenState,
        nodeRef: panelRef,
        unmountOnExit: true,
      },
      slotProps?.transition
    );

    const panel = (
      <Transition {...transitionProps}>
        {(transition) => (
          <Resizable
            {...rootProps}
            {...resizableProps}
            data-transition={transition}
            data-resizable={isResizable || undefined}
          >
            <Dialog {...dialogProps} ref={overlayRef} role="dialog">
              {isResizable && (
                <Resizable.Handle disableKeyboardResize {...resizerProps} />
              )}
              {children}
            </Dialog>
          </Resizable>
        )}
      </Transition>
    );

    if (containerState && portalContainer) {
      return createPortal(panel, portalContainer);
    }

    return panel;
  }
);

ContentPanelComponent.displayName = 'ContentPanel';

/**
 * ContentPanel — a side panel that slides in from the edge and pushes adjacent
 * content, commonly used for quick preview of an item from a table.
 */
export const ContentPanel = Object.assign(ContentPanelComponent, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
});
