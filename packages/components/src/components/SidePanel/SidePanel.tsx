'use client';

import { cloneElement, forwardRef, isValidElement } from 'react';

import { clsx, mergeProps, useBoolean, useDOMRef } from '@koobiq/react-core';
import {
  Overlay,
  useModalOverlay,
  useOverlayTrigger,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { Backdrop } from '../Backdrop';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
} from '../Dialog';

import s from './SidePanel.module.css';
import type { SidePanelProps, SidePanelRef } from './types';

const SidePanelComponent = forwardRef<SidePanelRef, SidePanelProps>(
  (props, ref) => {
    const {
      size = 'medium',
      position = 'left',
      hideCloseButton = false,
      control,
      children,
      slotProps,
      defaultOpen,
      onOpenChange,
      hideBackdrop,
      open: openProp,
      portalContainer,
      disableFocusManagement,
      disableExitOnClickOutside,
      disableExitOnEscapeKeyDown,
      shouldCloseOnInteractOutside,
      ...other
    } = props;

    const state = useOverlayTriggerState({
      isOpen: openProp,
      onOpenChange,
      defaultOpen,
      ...other,
    });

    const { isOpen: openState, close } = state;

    const [opened, { on, off }] = useBoolean(openState);

    const modalRef = useDOMRef(null);
    const containerRef = useDOMRef(ref);

    const { triggerProps, overlayProps } = useOverlayTrigger(
      { type: 'dialog' },
      { ...state, isOpen: openState }
    );

    const { modalProps: modalCommonProps, underlayProps } = useModalOverlay(
      {
        ...props,
        shouldCloseOnInteractOutside,
        isDismissable: !disableExitOnClickOutside,
        isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
      },
      { ...state, isOpen: opened },
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
        'data-position': position,
        className: clsx(s.base, s[size], s[position]),
      },
      other
    );

    const backdropProps = mergeProps(
      { open: openState && !hideBackdrop },
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

    const { isDisabled, ...otherTriggerProps } = triggerProps;

    return (
      <>
        {control?.({
          disabled: isDisabled,
          ...otherTriggerProps,
        })}
        <Transition
          onEnter={on}
          timeout={300}
          onExited={off}
          in={openState}
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
  Header: typeof DialogHeader;
  Body: typeof DialogContent;
  Footer: typeof DialogFooter;
};

export const SidePanel = SidePanelComponent as CompoundedComponent;

SidePanel.Header = DialogHeader;
SidePanel.Body = DialogContent;
SidePanel.Footer = DialogFooter;
