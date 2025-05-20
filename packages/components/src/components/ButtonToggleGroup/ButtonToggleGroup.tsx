'use client';

import { useRef, useState, forwardRef, useLayoutEffect } from 'react';

import {
  clsx,
  useDOMRef,
  mergeProps,
  useBoolean,
  usePrevious,
  useEventListener,
  useResizeObserver,
} from '@koobiq/react-core';
import {
  useToggleGroupState,
  useToggleButtonGroup,
} from '@koobiq/react-primitives';

import s from './ButtonToggleGroup.module.css';
import { ButtonToggleGroupContext } from './ButtonToggleGroupContext';
import type { ButtonToggleGroupProps, ButtonToggleGroupRef } from './types';

const MAX_ITEMS = 5;

export const ButtonToggleGroup = forwardRef<
  ButtonToggleGroupRef,
  ButtonToggleGroupProps
>((props, ref) => {
  const {
    equalItemSize = false,
    fullWidth = false,
    disabled = false,
    style,
    className,
    slotProps,
    defaultSelectedKey,
    children: childrenProp,
    selectedKey: selectedKeyProp,
    onSelectionChange: onSelectionChangeProp,
    ...other
  } = props;

  const children = childrenProp?.slice(0, MAX_ITEMS);

  const [animated, setAnimated] = useBoolean(false);

  const domRef = useDOMRef<ButtonToggleGroupRef>(ref);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const [selectedRect, setSelectedRect] = useState<DOMRect>();
  const [containerRef, { width: containerWidth }] = useResizeObserver();
  const containerRect = containerRef.current?.getBoundingClientRect();

  const thumbLeftOffset =
    (selectedRect?.left || 0) - (containerRect?.left || 0);

  const thumbWidth = selectedRect?.width;

  const config: Parameters<typeof useToggleGroupState>[0] = {
    ...other,
    isDisabled: disabled,
    selectionMode: 'single',
    disallowEmptySelection: true,
    onSelectionChange: (keys) => {
      onSelectionChangeProp?.(Array.from(keys)[0]);
    },
    selectedKeys: selectedKeyProp ? [selectedKeyProp] : undefined,
    defaultSelectedKeys: defaultSelectedKey ? [defaultSelectedKey] : undefined,
  };

  const state = useToggleGroupState(config);

  const { groupProps: groupPropsAria } = useToggleButtonGroup(
    config,
    state,
    domRef
  );

  const selectedKey = Array.from(state.selectedKeys)[0];

  const prevSelectedKey = usePrevious(selectedKey);

  // Start animation
  useLayoutEffect(() => {
    if (prevSelectedKey) {
      setAnimated.on();
    }
  }, [selectedKey]);

  // End animation
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
    other,
    groupPropsAria
  );

  const thumbProps = mergeProps(
    {
      ref: thumbRef,
      className: clsx(s.thumb),
      style: {
        inlineSize: `${thumbWidth}px`,
        transform: `translateX(${thumbLeftOffset}px)`,
      },
    },
    slotProps?.thumb
  );

  const containerProps = mergeProps(
    {
      className: clsx(s.container),
      ref: containerRef,
    },
    slotProps?.container
  );

  return (
    <ButtonToggleGroupContext.Provider
      value={{
        state,
        animated,
        equalItemSize,
        setSelectedRect,
        containerWidth,
      }}
    >
      <div {...groupProps}>
        {animated && <div {...thumbProps} />}
        <div {...containerProps}>{children}</div>
      </div>
    </ButtonToggleGroupContext.Provider>
  );
});

ButtonToggleGroup.displayName = 'ButtonToggleGroup';
