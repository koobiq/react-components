'use client';

import { cloneElement, forwardRef, isValidElement, useRef } from 'react';
import type { ComponentRef } from 'react';

import { mergeProps, useBoolean } from '@koobiq/react-core';
import {
  Overlay,
  useModalOverlay,
  useOverlayTrigger,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { Backdrop } from '../Backdrop';
import { Dialog, type DialogProps } from '../Dialog';

import type { ModalTriggerProps } from './index';

export const ModalTrigger = forwardRef<ComponentRef<'div'>, ModalTriggerProps>(
  (props, ref) => {
    const {
      open: openProp,
      onOpenChange,
      defaultOpen,
      disableExitOnEscapeKeyDown,
      disableExitOnClickOutside,
      disableFocusManagement,
      portalContainer,
      hideCloseButton,
      hideBackdrop,
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

    const dialogRef = useRef(null);

    const { triggerProps, overlayProps } = useOverlayTrigger(
      { type: 'dialog' },
      { ...state, isOpen: openState }
    );

    const { modalProps, underlayProps } = useModalOverlay(
      {
        ...props,
        isDismissable: !disableExitOnClickOutside,
        isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
      },
      { ...state, isOpen: opened },
      dialogRef
    );

    const resolvedChildren = () => {
      if (typeof children === 'function')
        return cloneElement(children({ close }), overlayProps);

      if (isValidElement(children)) return cloneElement(children, overlayProps);

      return children;
    };

    const backdropProps = mergeProps(
      { open: openState && !hideBackdrop },
      underlayProps,
      slotProps?.backdrop
    );

    const dialogProps: DialogProps = mergeProps(
      modalProps,
      {
        ref: dialogRef,
        hideCloseButton,
        onClose: close,
      },
      slotProps?.dialog
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
          nodeRef={dialogRef}
          unmountOnExit
          appear
        >
          {(state) => (
            <Overlay
              portalContainer={portalContainer}
              disableFocusManagement={disableFocusManagement}
            >
              <div data-transition={state} ref={ref} {...other}>
                <Backdrop {...backdropProps} />
                <Dialog {...dialogProps} role="dialog">
                  {resolvedChildren()}
                </Dialog>
              </div>
            </Overlay>
          )}
        </Transition>
      </>
    );
  }
);

ModalTrigger.displayName = 'ModalTrigger';
