import type { ComponentRef, CSSProperties, FC } from 'react';
import { useContext, useRef } from 'react';

import {
  clsx,
  useLocale,
  mergeProps,
  useBoolean,
  useDOMRef,
} from '@koobiq/react-core';
import {
  Overlay,
  useOverlayTrigger,
  usePopover,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';

import { useOverlayArrowStyle } from '../../hooks/useOverlayArrowStyle';
import { Dialog } from '../Dialog';

import s from './Popover.module.css';
import { PopoverGroupContext } from './PopoverGroupContext';
import type { PopoverInnerProps } from './types';
import { normalizeInlineSize } from './utils';

export const PopoverInner: FC<PopoverInnerProps> = (props) => {
  const {
    offset = 0,
    size = 'medium',
    crossOffset = 0,
    containerPadding = 12,
    arrowBoundaryOffset = 20,
    placement: placementProp = 'top',
    maxBlockSize = 480,
    type = 'dialog',
    trigger,
    hideArrow,
    shouldFlip,
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
  const targetRef = anchorRef || controlRef;
  const { direction } = useLocale();

  // A submenu joins the group of its menu instead of standing on its own.
  const group = useContext(PopoverGroupContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupContainer = trigger === 'SubmenuTrigger' ? group : null;

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
      shouldFlip,
      crossOffset,
      containerPadding,
      popoverRef: domRef,
      arrowBoundaryOffset,
      maxHeight: maxBlockSize,
      placement: placementProp,
      shouldCloseOnInteractOutside,
      triggerRef: targetRef,
      groupRef: groupContainer ?? containerRef,
      isKeyboardDismissDisabled: disableExitOnEscapeKeyDown,
    },
    { ...state, isOpen: openState || opened }
  );

  const arrowStyle = useOverlayArrowStyle({
    direction,
    placement: placementProp,
    arrowBoundaryOffset,
    arrowStyle: arrowPropsCommon.style,
    isEnabled: showArrow,
    overlayRef: domRef,
    targetRef,
  });

  const arrowProps = mergeProps(
    { className: s.arrow },
    { ...arrowPropsCommon, style: arrowStyle },
    slotProps?.arrow
  );

  const dialogProps = mergeProps(
    {
      role: 'dialog',
      hideCloseButton,
      className: s.dialog,
      onClose: state.close,
    },
    overlayProps,
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

  const resolvedChildren =
    typeof children === 'function'
      ? children({ close: state.close })
      : children;

  const renderPopover = (transition: string) => (
    <div
      ref={domRef}
      data-size={size}
      data-placement={placement}
      data-transition={transition}
      data-arrow={showArrow || undefined}
      className={clsx(s.base, s[size], className)}
      {...mergeProps(popoverProps, other)}
      style={
        {
          ...props.style,
          ...popoverProps.style,
          '--popover-inline-size': normalizeInlineSize(size),
        } as CSSProperties
      }
    >
      {showArrow && <div {...arrowProps} data-placement={placement} />}
      <div
        {...slotProps?.container}
        className={clsx(s.container, slotProps?.container?.className)}
      >
        {type === 'dialog' ? (
          <Dialog {...dialogProps}>{resolvedChildren}</Dialog>
        ) : (
          resolvedChildren
        )}
      </div>
    </div>
  );

  return (
    <>
      {control?.({
        ref: controlRef,
        ...triggerProps,
      })}
      <Transition {...transitionProps}>
        {(transition) =>
          groupContainer ? (
            // Inside the group container, so a click here is not an outside one.
            <Overlay
              portalContainer={
                portalContainer ?? groupContainer.current ?? undefined
              }
              disableFocusManagement={disableFocusManagement}
            >
              {renderPopover(transition)}
            </Overlay>
          ) : (
            <Overlay
              portalContainer={portalContainer}
              disableFocusManagement={disableFocusManagement}
            >
              <div {...backdropProps} />
              {/* Box-less anchor of the group, left out of the backdrop. */}
              <div ref={containerRef} style={{ display: 'contents' }}>
                <PopoverGroupContext.Provider value={containerRef}>
                  {renderPopover(transition)}
                </PopoverGroupContext.Provider>
              </div>
            </Overlay>
          )
        }
      </Transition>
    </>
  );
};
