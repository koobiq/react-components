'use client';

import { useRef, useState, forwardRef, useLayoutEffect } from 'react';

import {
  clsx,
  useDOMRef,
  mergeProps,
  useBoolean,
  useIsFirstRender,
  useEventListener,
} from '@koobiq/react-core';
import {
  useToggleGroupState,
  useToggleButtonGroup,
} from '@koobiq/react-primitives';

import s from './ButtonToggleGroup.module.css';
import { ButtonToggleGroupContext } from './ButtonToggleGroupContext';
import type { ButtonToggleGroupProps, ButtonToggleGroupRef } from './types';

export const ButtonToggleGroup = forwardRef<
  ButtonToggleGroupRef,
  ButtonToggleGroupProps
>((props, ref) => {
  const {
    style,
    className,
    fullWidth = false,
    equalItemSize = false,
    disabled,
    children,
  } = props;

  const [animated, setAnimated] = useBoolean(false);

  const domRef = useDOMRef<ButtonToggleGroupRef>(ref);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const state = useToggleGroupState({
    ...props,
    isDisabled: disabled,
    disallowEmptySelection: true,
  });

  const [selectedRect, setSelectedRect] = useState<DOMRect>();

  const parentRect = domRef.current?.getBoundingClientRect();

  const leftRelativeToParent =
    (selectedRect?.left || 0) - (parentRect?.left || 0);

  const { groupProps: groupPropsAria } = useToggleButtonGroup(
    { ...props, isDisabled: disabled, disallowEmptySelection: true },
    state,
    domRef
  );

  const firstRender = useIsFirstRender();

  const selectedKey = Array.from(state.selectedKeys)[0];

  // start animation
  useLayoutEffect(() => {
    if (!firstRender) setAnimated.on();
  }, [selectedKey]);

  // end animation
  useEventListener({
    element: thumbRef,
    handler: setAnimated.off,
    eventName: 'transitionend',
  });

  const groupProps = mergeProps(
    {
      className: clsx(
        s.base,
        fullWidth && s.fullWidth,
        equalItemSize && s.equalItemSize,
        className
      ),
      ref: domRef,
      style,
    },
    groupPropsAria
  );

  const thumbProps = mergeProps({
    ref: thumbRef,
    className: clsx(s.thumb),
    style: {
      width: `${selectedRect?.width}px`,
      transform: `translateX(${leftRelativeToParent}px)`,
    },
  });

  return (
    <ButtonToggleGroupContext.Provider
      value={{
        state,
        animated,
        equalItemSize,
        setSelectedRect,
      }}
    >
      <div {...groupProps}>
        {selectedRect && animated && <div {...thumbProps} />}
        <div className={clsx(s.inner)}>{children}</div>
      </div>
    </ButtonToggleGroupContext.Provider>
  );
});

ButtonToggleGroup.displayName = 'ButtonToggleGroup';
