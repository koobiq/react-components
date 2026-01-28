'use client';

import { forwardRef, type HTMLAttributes, useContext, useRef } from 'react';

import {
  useDOMRef,
  useMultiRef,
  mergeProps,
  clsx,
  isNumber,
} from '@koobiq/react-core';
import {
  useContextProps,
  useOverlay,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  type DialogProps,
} from '../Dialog';

import { ContentPanelContainerContext } from './components';
import { TRANSITION_TIMEOUT } from './constants';
import s from './ContentPanel.module.css';
import { ContentPanelContext } from './ContentPanelContext';
import { useContentPanel } from './hooks';
import type { ContentPanelProps, ContentPanelRef } from './types';

const ContentPanelComponent = forwardRef<ContentPanelRef, ContentPanelProps>(
  (props, ref) => {
    const {
      defaultWidth,
      minWidth: minWidthProp,
      maxWidth: maxWidthProp,
      isResizable,
      width,
      onResize,
      onResizeEnd,
      onResizeStart,
      isOpen,
      onOpenChange,
      defaultOpen,
      className,
      style,
      children,
      slotProps,
      ...other
    } = props;

    const domRef = useDOMRef<HTMLDivElement>(ref);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const {
      state: containerState,
      portalContainer,
      containerWidth,
    } = useContext(ContentPanelContainerContext);

    const componentState = useOverlayTriggerState({
      isOpen,
      onOpenChange,
      defaultOpen,
    });

    const state = containerState ?? componentState;
    const { isOpen: isOpenState, close } = state;

    const maxWidth = Math.min(
      isNumber(containerWidth) ? containerWidth : Number.POSITIVE_INFINITY,
      isNumber(maxWidthProp) ? maxWidthProp : Number.POSITIVE_INFINITY
    );

    const minWidth = Math.max(0, isNumber(minWidthProp) ? minWidthProp : 200);

    const { panelRef, panelProps, resizerProps } = useContentPanel({
      isResizable,
      width,
      defaultWidth,
      minWidth,
      maxWidth,
      onResize,
      onResizeEnd,
      onResizeStart,
    });

    const [ctxPanelProps, ctxPanelRef] = useContextProps(
      {
        slotProps,
        className: clsx(s.base, className),
        style: {
          ...panelProps.style,
          '--content-panel-transition-duration': `${TRANSITION_TIMEOUT}ms`,
          ...style,
        },
      },
      domRef,
      ContentPanelContext
    );

    const dialogRef = useMultiRef([ctxPanelRef, panelRef, overlayRef]);

    const { overlayProps } = useOverlay(
      {
        isOpen: isOpenState,
        onClose: close,
        isKeyboardDismissDisabled: false,
      },
      overlayRef
    );

    const dialogProps = mergeProps<
      [
        DialogProps,
        DialogProps,
        HTMLAttributes<HTMLElement>,
        HTMLAttributes<HTMLElement>,
        HTMLAttributes<HTMLElement>,
      ]
    >(
      {
        onKeyDown: (event) => {
          if (event.key === 'Escape' && !containerState) {
            state.close();
          }
        },
        'data-resizable': isResizable || undefined,
      },
      other,
      panelProps,
      ctxPanelProps,
      overlayProps
    );

    const transitionProps = mergeProps(
      {
        timeout: TRANSITION_TIMEOUT,
        in: isOpenState,
        nodeRef: ctxPanelRef,
        unmountOnExit: true,
      },
      ctxPanelProps.slotProps?.transition
    );

    const panel = (
      <Transition {...transitionProps}>
        {(transition) => (
          <Dialog
            onClose={close}
            ref={dialogRef}
            data-transition={transition}
            {...dialogProps}
            role="dialog"
          >
            {isResizable && <div {...resizerProps} className={s.resizer} />}
            {children}
          </Dialog>
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

type CompoundedComponent = typeof ContentPanelComponent & {
  Header: typeof DialogHeader;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
};

export const ContentPanel = ContentPanelComponent as CompoundedComponent;

ContentPanel.Header = DialogHeader;
ContentPanel.Body = DialogBody;
ContentPanel.Footer = DialogFooter;
