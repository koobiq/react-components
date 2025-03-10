'use client';

import { cloneElement, forwardRef, isValidElement, useRef } from 'react';
import type { ComponentRef } from 'react';

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
      arrowBoundaryOffset = 20,
      size = 'medium',
      hideArrow = false,
      placement: placementProp = 'top',
      crossOffset = 0,
      offset = 0,
      open: openProp,
      anchorRef,
      isNonModal,
      disableExitOnEscapeKeyDown,
      disableFocusManagement,
      portalContainer,
      children,
      control,
      ...other
    } = props;

    const showArrow = !hideArrow;

    const domRef = useDOMRef<ComponentRef<'div'>>(ref);
    const controlRef = useRef<HTMLButtonElement | null>(null);

    const state = useOverlayTriggerState({
      isOpen: openProp,
      ...other,
    });

    const openState = state.isOpen;

    const [opened, { on, off }] = useBoolean(openState);

    const { triggerProps, overlayProps } = useOverlayTrigger(
      { type: 'dialog' },
      { ...state, isOpen: openState }
    );

    const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
      {
        ...props,
        offset,
        isNonModal,
        crossOffset,
        maxHeight: 480,
        placement: placementProp,
        popoverRef: domRef,
        arrowBoundaryOffset,
        containerPadding: 24,
        isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
        triggerRef: anchorRef || controlRef,
      },
      { ...state, isOpen: opened }
    );

    const dialogProps = mergeProps(
      popoverProps,
      {
        onClose: state.close,
        className: clsx(s.base, s[size]),
        style: {
          ...popoverProps.style,
          '--popover-inline-size': normalizeInlineSize(size),
        },
        ref: domRef,
      },
      other
    );

    const resolvedChildren = () => {
      if (typeof children === 'function')
        return cloneElement(children({ close: state.close }), overlayProps);

      if (isValidElement(children)) return cloneElement(children, overlayProps);

      return children;
    };

    const { isDisabled, onPress, ...otherTriggerProps } = triggerProps;

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
              <div {...underlayProps} className={s.underlay} />
              <Dialog
                {...dialogProps}
                role="dialog"
                data-size={size}
                data-arrow={showArrow}
                data-transition={transition}
                data-placement={placement}
                {...(showArrow && {
                  startAddon: (
                    <div
                      {...arrowProps}
                      className={s.arrow}
                      data-placement={placement}
                    />
                  ),
                })}
              >
                {resolvedChildren()}
              </Dialog>
            </Overlay>
          )}
        </Transition>
      </>
    );
  }
);

Popover.displayName = 'Popover';
