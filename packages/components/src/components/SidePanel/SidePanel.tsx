'use client';

import { cloneElement, forwardRef, isValidElement } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, mergeProps, useBoolean, useDOMRef } from '@koobiq/react-core';
import {
  Overlay,
  useModalOverlay,
  useOverlayTrigger,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { Backdrop, type BackdropProps } from '../Backdrop';
import { Dialog, type DialogProps } from '../Dialog';

import s from './SidePanel.module.css';
import type { SidePanelProps, SidePanelRef } from './types';

const SidePanelComponent = forwardRef<SidePanelRef, SidePanelProps>(
  (props, ref) => {
    const {
      size = 'medium',
      position = 'left',
      placement = 'start',
      hideCloseButton,
      control,
      children,
      slotProps,
      defaultOpen,
      onOpenChange,
      hideBackdrop,
      open,
      isOpen: isOpenProp,
      portalContainer,
      disableFocusManagement,
      disableExitOnClickOutside,
      disableExitOnEscapeKeyDown,
      shouldCloseOnInteractOutside,
      ...other
    } = props;

    const isOpen = isOpenProp ?? open;

    if (process.env.NODE_ENV !== 'production' && 'open' in props) {
      deprecate(
        'SidePanel: the "open" prop is deprecated. Use "isOpen" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'position' in props) {
      deprecate(
        'SidePanel: the "position" prop is deprecated. Use "placement" prop to replace it.'
      );
    }

    const state = useOverlayTriggerState({
      isOpen,
      onOpenChange,
      defaultOpen,
      ...other,
    });

    const { isOpen: isOpenState, close } = state;

    const [isOpened, { on, off }] = useBoolean(isOpenState);

    const modalRef = useDOMRef(null);
    const containerRef = useDOMRef(ref);

    const { triggerProps, overlayProps } = useOverlayTrigger(
      { type: 'dialog' },
      { ...state, isOpen: isOpenState }
    );

    const { modalProps: modalCommonProps, underlayProps } = useModalOverlay(
      {
        ...props,
        shouldCloseOnInteractOutside,
        isDismissable: !disableExitOnClickOutside,
        isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
      },
      { ...state, isOpen: isOpened },
      modalRef
    );

    const resolvedChildren = () => {
      if (typeof children === 'function')
        return cloneElement(children({ close }), overlayProps);

      if (isValidElement(children)) return cloneElement(children, overlayProps);

      return children;
    };

    const containerProps = mergeProps(
      {
        ref: containerRef,
        'data-size': size,
        'data-placement': placement,
        className: clsx(s.base, s[size], s[position], s[placement]),
      },
      other
    );

    const backdropProps = mergeProps<
      [BackdropProps, BackdropProps, BackdropProps | undefined]
    >(
      { isOpen: isOpenState && !hideBackdrop },
      underlayProps,
      slotProps?.backdrop
    );

    const dialogProps: DialogProps = mergeProps(
      {
        onClose: close,
        role: 'dialog',
        hideCloseButton,
        children: resolvedChildren(),
      },
      slotProps?.dialog
    );

    const panelProps = mergeProps(
      modalCommonProps,
      {
        ref: modalRef,
        className: s.panel,
      },
      slotProps?.panel
    );

    return (
      <>
        {control?.(triggerProps)}
        <Transition
          onEnter={on}
          timeout={300}
          onExited={off}
          in={isOpenState}
          nodeRef={containerRef}
          unmountOnExit
          appear
        >
          {(transition) => (
            <Overlay
              portalContainer={portalContainer}
              disableFocusManagement={disableFocusManagement}
            >
              <div {...containerProps} data-transition={transition}>
                <Backdrop {...backdropProps} />
                <div {...panelProps}>
                  <Dialog {...dialogProps} />
                </div>
              </div>
            </Overlay>
          )}
        </Transition>
      </>
    );
  }
);

SidePanelComponent.displayName = 'SidePanel';

type CompoundedComponent = typeof SidePanelComponent & {
  Header: typeof Dialog.Header;
  Body: typeof Dialog.Body;
  Footer: typeof Dialog.Footer;
};

export const SidePanel = SidePanelComponent as CompoundedComponent;

SidePanel.Header = Dialog.Header;
SidePanel.Body = Dialog.Body;
SidePanel.Footer = Dialog.Footer;
