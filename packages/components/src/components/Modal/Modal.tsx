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

import { Backdrop, type BackdropProps } from '../Backdrop';
import { Dialog, type DialogProps } from '../Dialog';

import s from './Modal.module.css';
import type { ModalProps, ModalRef } from './types';

const ModalComponent = forwardRef<ModalRef, ModalProps>((props, ref) => {
  const {
    size = 'medium',
    hideCloseButton = false,
    control,
    children,
    slotProps,
    defaultOpen,
    hideBackdrop,
    onOpenChange,
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
      className: clsx(s.base, s[size]),
    },
    other
  );

  const backdropProps = mergeProps<
    [BackdropProps, BackdropProps, BackdropProps | undefined]
  >({ isOpen: openState && !hideBackdrop }, underlayProps, slotProps?.backdrop);

  const dialogProps: DialogProps = mergeProps(
    {
      onClose: close,
      role: 'dialog',
      hideCloseButton,
      children: resolvedChildren(),
    },
    slotProps?.dialog
  );

  const modalProps = mergeProps(
    modalCommonProps,
    {
      ref: modalRef,
      className: s.modal,
    },
    slotProps?.modal
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
              <div {...modalProps}>
                <Dialog {...dialogProps} />
              </div>
            </div>
          </Overlay>
        )}
      </Transition>
    </>
  );
});

ModalComponent.displayName = 'Modal';

type CompoundedComponent = typeof ModalComponent & {
  Header: typeof Dialog.Header;
  Body: typeof Dialog.Body;
  Footer: typeof Dialog.Footer;
};

export const Modal = ModalComponent as CompoundedComponent;

Modal.Header = Dialog.Header;
Modal.Body = Dialog.Body;
Modal.Footer = Dialog.Footer;
