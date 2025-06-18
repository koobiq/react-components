'use client';

import type { ComponentRef, CSSProperties, FC } from 'react';
import { cloneElement, forwardRef, isValidElement, useRef } from 'react';

import { clsx, mergeProps, useBoolean, useDOMRef } from '@koobiq/react-core';
import {
  Overlay,
  usePopover,
  useOverlayTrigger,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';

import { Dialog } from '../Dialog';

import s from './Popover.module.css';
import type { PopoverInnerProps, PopoverProps } from './types';
import { normalizeInlineSize } from './utils';

export const PopoverInner: FC<PopoverInnerProps> = (props) => {
  const {
    offset = 0,
    size = 'medium',
    crossOffset = 0,
    hideArrow = false,
    containerPadding = 12,
    arrowBoundaryOffset = 20,
    placement: placementProp = 'top',
    maxBlockSize = 480,
    type = 'dialog',
    state,
    control,
    children,
    anchorRef,
    slotProps,
    className,
    isNonModal,
    popoverRef,
    portalContainer,
    hideCloseButton,
    disableFocusManagement,
    disableExitOnEscapeKeyDown,
    shouldCloseOnInteractOutside,
    ...other
  } = props;

  const showArrow = !hideArrow;

  const domRef = useDOMRef<ComponentRef<'div'>>(popoverRef);

  const controlRef = useRef<HTMLButtonElement | null>(null);

  const openState = state.isOpen;

  const [opened, { on, off }] = useBoolean(openState);

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type },
    { ...state, isOpen: openState }
  );

  const {
    popoverProps,
    underlayProps,
    arrowProps: arrowPropsCommon,
    placement,
  } = usePopover(
    {
      ...props,
      offset,
      isNonModal,
      crossOffset,
      containerPadding,
      popoverRef: domRef,
      arrowBoundaryOffset,
      maxHeight: maxBlockSize,
      placement: placementProp,
      shouldCloseOnInteractOutside,
      triggerRef: anchorRef || controlRef,
      isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
    },
    { ...state, isOpen: openState || opened }
  );

  const resolvedChildren = () => {
    if (typeof children === 'function')
      return cloneElement(children({ close: state.close }), overlayProps);

    if (isValidElement(children)) return cloneElement(children, overlayProps);

    return children;
  };

  const arrowProps = mergeProps(
    { className: s.arrow },
    arrowPropsCommon,
    slotProps?.arrow
  );

  const dialogProps = mergeProps(
    {
      role: 'dialog',
      hideCloseButton,
      className: s.dialog,
      onClose: state.close,
    },
    slotProps?.dialog
  );

  const backdropProps = mergeProps(
    { className: s.underlay },
    slotProps?.backdrop,
    underlayProps
  );

  const transitionProps: TransitionProps<HTMLElement> = mergeProps(
    {
      timeout: 120,
      onEnter: on,
      onExited: off,
      appear: true,
      in: openState,
      nodeRef: domRef,
      unmountOnExit: true,
    },
    slotProps?.transition
  );

  return (
    <>
      {control?.({
        ref: controlRef,
        ...triggerProps,
      })}
      <Transition {...transitionProps}>
        {(transition) => (
          <Overlay
            portalContainer={portalContainer}
            disableFocusManagement={disableFocusManagement}
          >
            <div {...backdropProps} />
            <div
              ref={domRef}
              data-size={size}
              data-arrow={showArrow}
              data-placement={placement}
              data-transition={transition}
              className={clsx(s.base, s[size], className)}
              {...mergeProps(popoverProps, other)}
              style={
                {
                  ...popoverProps.style,
                  '--popover-inline-size': normalizeInlineSize(size),
                } as CSSProperties
              }
            >
              {showArrow && <div {...arrowProps} data-placement={placement} />}
              <div className={s.container}>
                {type === 'dialog' ? (
                  <Dialog {...dialogProps}>{resolvedChildren()}</Dialog>
                ) : (
                  resolvedChildren()
                )}
              </div>
            </div>
          </Overlay>
        )}
      </Transition>
    </>
  );
};

const PopoverComponent = forwardRef<ComponentRef<'div'>, PopoverProps>(
  (props, ref) => {
    const { open, onOpenChange, defaultOpen, ...other } = props;

    const state = useOverlayTriggerState({
      isOpen: open,
      onOpenChange,
      defaultOpen,
      ...other,
    });

    return <PopoverInner popoverRef={ref} {...other} state={state} />;
  }
);

PopoverComponent.displayName = 'Popover';

type CompoundedComponent = typeof PopoverComponent & {
  Header: typeof Dialog.Header;
  Body: typeof Dialog.Body;
  Footer: typeof Dialog.Footer;
};

export const Popover = PopoverComponent as CompoundedComponent;

Popover.Header = Dialog.Header;
Popover.Body = Dialog.Body;
Popover.Footer = Dialog.Footer;
