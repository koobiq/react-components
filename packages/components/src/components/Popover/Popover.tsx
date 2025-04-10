'use client';

import type { ComponentRef, CSSProperties } from 'react';
import { cloneElement, forwardRef, isValidElement, useRef } from 'react';

import { clsx, mergeProps, useBoolean, useDOMRef } from '@koobiq/react-core';
import {
  Overlay,
  usePopover,
  useOverlayTrigger,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { Dialog } from '../Dialog';

import s from './Popover.module.css';
import type { PopoverProps } from './types';
import { normalizeInlineSize } from './utils';

export const Popover = forwardRef<ComponentRef<'div'>, PopoverProps>(
  (props, ref) => {
    const {
      offset = 0,
      size = 'medium',
      crossOffset = 0,
      hideArrow = false,
      containerPadding = 12,
      arrowBoundaryOffset = 20,
      placement: placementProp = 'top',
      control,
      children,
      anchorRef,
      slotProps,
      className,
      isNonModal,
      defaultOpen,
      onOpenChange,
      open: openProp,
      portalContainer,
      hideCloseButton,
      disableFocusManagement,
      disableExitOnEscapeKeyDown,
      shouldCloseOnInteractOutside,
      ...other
    } = props;

    const showArrow = !hideArrow;

    const domRef = useDOMRef<ComponentRef<'div'>>(ref);
    const controlRef = useRef<HTMLButtonElement | null>(null);

    const state = useOverlayTriggerState({
      defaultOpen,
      onOpenChange,
      isOpen: openProp,
      ...other,
    });

    const openState = state.isOpen;

    const [opened, { on, off }] = useBoolean(openState);

    const { triggerProps, overlayProps } = useOverlayTrigger(
      { type: 'dialog' },
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
        maxHeight: 480,
        containerPadding,
        popoverRef: domRef,
        arrowBoundaryOffset,
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

    const { isDisabled, onPress, ...otherTriggerProps } = triggerProps;

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
      {
        className: s.underlay,
      },
      slotProps?.backdrop,
      underlayProps
    );

    return (
      <>
        {control?.({
          ref: controlRef,
          onClick: onPress,
          disabled: isDisabled,
          ...otherTriggerProps,
        })}
        <Transition
          onEnter={on}
          timeout={300}
          onExited={off}
          in={openState}
          key={placement}
          nodeRef={domRef}
          unmountOnExit
          appear
        >
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
                {showArrow && (
                  <div {...arrowProps} data-placement={placement} />
                )}
                <Dialog {...dialogProps}>{resolvedChildren()}</Dialog>
              </div>
            </Overlay>
          )}
        </Transition>
      </>
    );
  }
);

Popover.displayName = 'Popover';
