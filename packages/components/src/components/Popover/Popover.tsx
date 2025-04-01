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
      placement: placementProp = 'top',
      arrowBoundaryOffset = 20,
      containerPadding = 12,
      hideArrow = false,
      size = 'medium',
      crossOffset = 0,
      offset = 0,
      slotProps,
      disableExitOnEscapeKeyDown,
      disableFocusManagement,
      portalContainer,
      hideCloseButton,
      open: openProp,
      className,
      defaultOpen,
      onOpenChange,
      isNonModal,
      anchorRef,
      children,
      control,
      ...other
    } = props;

    const showArrow = !hideArrow;

    const domRef = useDOMRef<ComponentRef<'div'>>(ref);
    const controlRef = useRef<HTMLButtonElement | null>(null);

    const state = useOverlayTriggerState({
      isOpen: openProp,
      onOpenChange,
      defaultOpen,
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
        isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
        triggerRef: anchorRef || controlRef,
      },
      { ...state, isOpen: opened }
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
        className: s.dialog,
        onClose: state.close,
        hideCloseButton,
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
          onClick: onPress,
          ref: controlRef,
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
