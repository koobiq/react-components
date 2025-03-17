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
import { Dialog, type DialogProps } from '../Dialog';

import s from './SidePanel.module.css';
import type { SidePanelProps, SidePanelRef } from './types';

export const SidePanel = forwardRef<SidePanelRef, SidePanelProps>(
  (props, ref) => {
    const {
      hideCloseButton = false,
      position = 'left',
      size = 'medium',
      disableExitOnEscapeKeyDown,
      disableExitOnClickOutside,
      disableFocusManagement,
      portalContainer,
      open: openProp,
      hideBackdrop,
      onOpenChange,
      defaultOpen,
      children,
      control,
      slotProps,
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
        className: clsx(s.base, s[size], s[position]),
        'data-size': size,
        'data-position': position,
        ref: containerRef,
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
        className: s.panel,
        ref: modalRef,
      },
      slotProps?.panel
    );

    const { isDisabled, onPress, ...otherTriggerProps } = triggerProps;

    return (
      <>
        {control?.({
          onClick: onPress,
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

SidePanel.displayName = 'SidePanel';
