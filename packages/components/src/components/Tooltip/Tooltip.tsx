'use client';

import { type ComponentRef, forwardRef, useRef } from 'react';

import {
  clsx,
  useDOMRef,
  mergeProps,
  useBoolean,
  FocusableProvider,
  useMultiRef,
} from '@koobiq/react-core';
import {
  Overlay,
  useTooltip,
  useTooltipTrigger,
  useOverlayPosition,
  useTooltipTriggerState,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import { utilClasses } from '../../styles/utility';

import s from './Tooltip.module.css';
import type { TooltipProps, TooltipRef } from './types';

export const Tooltip = forwardRef<TooltipRef, TooltipProps>((props, ref) => {
  const {
    delay = 120,
    disabled = false,
    closeDelay = 120,
    hideArrow = false,
    variant = 'contrast',
    placement: placementProp = 'top',
    control,
    children,
    anchorRef,
    crossOffset,
    defaultOpen,
    onOpenChange,
    open: openProp,
    portalContainer,
    offset: offsetProp,
    arrowBoundaryOffset,
    ...other
  } = props;

  const showArrow = !hideArrow;

  const offset = showArrow ? offsetProp : offsetProp || 4;

  const state = useTooltipTriggerState({
    delay,
    closeDelay,
    defaultOpen,
    onOpenChange,
    isOpen: openProp,
    isDisabled: disabled,
    ...other,
  });

  const domRef = useDOMRef<ComponentRef<'div'>>(ref);
  const controlRef = useRef<HTMLElement | null>(null);
  const controlRefCallback = useMultiRef([controlRef]);

  const { triggerProps, tooltipProps } = useTooltipTrigger(
    {
      delay,
      closeDelay,
      defaultOpen,
      onOpenChange,
      isOpen: openProp,
      isDisabled: disabled,
      ...other,
    },
    state,
    controlRef
  );

  const openState = state.isOpen;

  const [opened, { on, off }] = useBoolean(openState);

  const { overlayProps, arrowProps, placement } = useOverlayPosition({
    offset,
    crossOffset,
    isOpen: opened,
    maxHeight: 480,
    overlayRef: domRef,
    arrowBoundaryOffset,
    placement: placementProp,
    onClose: () => state.close(true),
    targetRef: anchorRef || controlRef,
  });

  const { tooltipProps: localTooltipProps } = useTooltip(overlayProps, state);

  return (
    <>
      <FocusableProvider {...triggerProps} ref={controlRef}>
        {control?.({
          ref: controlRefCallback,
          ...triggerProps,
        })}
      </FocusableProvider>
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
          <Overlay portalContainer={portalContainer}>
            <div
              {...mergeProps(localTooltipProps, tooltipProps)}
              data-arrow={showArrow}
              data-variant={variant}
              data-placement={placement}
              data-transition={transition}
              className={clsx(
                s.base,
                s[variant],
                utilClasses.typography['text-normal']
              )}
              {...other}
              ref={domRef}
            >
              {showArrow && (
                <div
                  {...arrowProps}
                  className={s.arrow}
                  data-placement={placement}
                />
              )}
              <div className={s.container}>
                <div className={s.content}>{children}</div>
              </div>
            </div>
          </Overlay>
        )}
      </Transition>
    </>
  );
});

Tooltip.displayName = 'Tooltip';
