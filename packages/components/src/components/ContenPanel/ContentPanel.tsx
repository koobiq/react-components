'use client';

import {
  type ComponentPropsWithRef,
  forwardRef,
  type HTMLAttributes,
  type CSSProperties,
  useContext,
  useRef,
} from 'react';

import { useDOMRef, mergeProps, clsx, isNumber } from '@koobiq/react-core';
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
    const domRef = useDOMRef<HTMLDivElement>(ref);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const [panelProps, panelRef] = useContextProps(
      props,
      domRef,
      ContentPanelContext
    );

    const {
      defaultWidth: defaultWidthProp,
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
      hideCloseButton,
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

    const maxWidth = Math.min(
      isNumber(containerWidth) ? containerWidth : Number.POSITIVE_INFINITY,
      isNumber(maxWidthProp) ? maxWidthProp : Number.POSITIVE_INFINITY
    );

    const minWidth = Math.max(0, isNumber(minWidthProp) ? minWidthProp : 200);

    const defaultWidth = defaultWidthProp ?? 400;

    const { width: panelWidth, resizerProps: moveProps } = useContentPanel({
      width,
      isResizable,
      minWidth,
      maxWidth,
      onResize,
      onResizeEnd,
      onResizeStart,
      defaultWidth,
    });

    const { overlayProps } = useOverlay(
      {
        onClose: close,
        isOpen: isOpenState,
        isKeyboardDismissDisabled: false,
      },
      overlayRef
    );

    const rootProps = mergeProps<ComponentPropsWithRef<'div'>[]>(
      {
        ref: panelRef,
        className: clsx(s.base, className),
        onKeyDown: (event) => {
          if (event.key === 'Escape' && !containerState) {
            state.close();
          }
        },
        style: {
          inlineSize: panelWidth,
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

    const resizerProps = mergeProps(
      {
        className: s.resizer,
      },
      slotProps?.resizer,
      moveProps
    );

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
          <div
            {...rootProps}
            data-transition={transition}
            data-resizable={isResizable || undefined}
          >
            <Dialog {...dialogProps} role="dialog">
              {isResizable && <div {...resizerProps} />}
              {children}
            </Dialog>
          </div>
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
