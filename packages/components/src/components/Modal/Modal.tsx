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

import s from './Modal.module.css';
import type { ModalProps, ModalRef } from './types';

export const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
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
      ref: containerRef,
      'data-size': size,
      className: clsx(s.base, s[size]),
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

  const modalProps = mergeProps(
    modalCommonProps,
    {
      ref: modalRef,
      className: s.modal,
    },
    slotProps?.modal
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

Modal.displayName = 'Modal';
