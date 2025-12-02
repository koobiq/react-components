'use client';

import { type ComponentRef, forwardRef, useRef } from 'react';

import { deprecate } from '@koobiq/logger';
import {
  clsx,
  useDOMRef,
  mergeProps,
  useBoolean,
  useMultiRef,
  type FocusableElement,
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
    variant = 'contrast',
    placement: placementProp = 'top',
    closeDelay = 120,
    delay = 120,
    isDisabled: isDisabledProp,
    isOpen: isOpenProp,
    disabled,
    open,
    hideArrow,
    control,
    children,
    anchorRef,
    crossOffset,
    defaultOpen,
    onOpenChange,
    portalContainer,
    offset: offsetProp,
    arrowBoundaryOffset,
    ...other
  } = props;

  const isOpen = isOpenProp ?? open;
  const isDisabled = isDisabledProp ?? disabled;

  if (process.env.NODE_ENV !== 'production' && 'open' in props) {
    deprecate(
      'Tooltip: the "open" prop is deprecated. Use "isOpen" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'Tooltip: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  const showArrow = !hideArrow;

  const offset = showArrow ? offsetProp : offsetProp || 4;

  const state = useTooltipTriggerState({
    delay,
    closeDelay,
    defaultOpen,
    onOpenChange,
    isOpen,
    isDisabled,
    ...other,
  });

  const domRef = useDOMRef<ComponentRef<'div'>>(ref);
  const controlRef = useRef<FocusableElement>(null);
  const controlRefCallback = useMultiRef([controlRef]);

  const { triggerProps, tooltipProps: tooltipTriggerProps } = useTooltipTrigger(
    {
      delay,
      isOpen,
      isDisabled,
      closeDelay,
      defaultOpen,
      onOpenChange,
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

  const { tooltipProps: tooltipCommonProps } = useTooltip(overlayProps, state);

  const tooltipProps = mergeProps(
    {
      className: clsx(
        s.base,
        s[variant],
        utilClasses.typography['text-normal']
      ),
      ref: domRef,
    },
    other,
    tooltipCommonProps,
    tooltipTriggerProps
  );

  return (
    <>
      {control?.({
        ref: controlRefCallback,
        ...triggerProps,
      })}
      <Transition
        onEnter={on}
        timeout={120}
        onExited={off}
        in={openState}
        nodeRef={domRef}
        unmountOnExit
        appear
      >
        {(transition) => (
          <Overlay portalContainer={portalContainer}>
            <div
              {...tooltipProps}
              data-variant={variant}
              data-transition={transition}
              data-arrow={showArrow || undefined}
              data-placement={placement || undefined}
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
