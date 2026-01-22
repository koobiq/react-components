'use client';

import { forwardRef, type HTMLAttributes, useContext, useRef } from 'react';

import { useDOMRef, useMultiRef, mergeProps, clsx } from '@koobiq/react-core';
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
import s from './ContentPanel.module.css';
import { ContentPanelContext } from './ContentPanelContext';
import { useContentPanelResize } from './hooks';
import type { ContentPanelProps, ContentPanelRef } from './types';

const ContentPanelComponent = forwardRef<ContentPanelRef, ContentPanelProps>(
  (props, ref) => {
    const {
      defaultWidth,
      minWidth,
      maxWidth,
      isResizable,
      width,
      onResize,
      isOpen,
      onOpenChange,
      defaultOpen,
      className,
      style,
      children,
    } = props;

    const domRef = useDOMRef<HTMLDivElement>(ref);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const { state: containerState, portalContainer } = useContext(
      ContentPanelContainerContext
    );

    const componentState = useOverlayTriggerState({
      isOpen,
      onOpenChange,
      defaultOpen,
    });

    const state = containerState ?? componentState;
    const { isOpen: isOpenState, close } = state;

    const { panelRef, panelProps, resizerProps } = useContentPanelResize({
      isResizable,
      width,
      defaultWidth,
      minWidth,
      maxWidth,
      onResize,
    });

    const [ctxPanelProps, ctxPanelRef] = useContextProps(
      {
        className: clsx(s.base, className),
        style: { ...panelProps.style, ...style },
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
      },
      panelProps,
      ctxPanelProps,
      overlayProps
    );

    const panel = (
      <Transition
        timeout={300}
        in={isOpenState}
        nodeRef={ctxPanelRef}
        unmountOnExit
        appear
      >
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
