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
    equalItemSize = false,
    fullWidth = false,
    disabled = false,
    selectedKey,
    style,
    children,
    className,
    slotProps,
    defaultSelectedKey,
    onSelectionChange: onSelectionChangeProp,
    ...other
  } = props;

  const [animated, setAnimated] = useBoolean(false);

  const domRef = useDOMRef<ButtonToggleGroupRef>(ref);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const firstRender = useIsFirstRender();
  const [selectedRect, setSelectedRect] = useState<DOMRect>();
  const parentRect = domRef.current?.getBoundingClientRect();

  const leftRelativeToParent =
    (selectedRect?.left || 0) - (parentRect?.left || 0);

  const state = useToggleGroupState({
    ...other,
    isDisabled: disabled,
    selectionMode: 'single',
    disallowEmptySelection: true,
    onSelectionChange: (keys) => {
      onSelectionChangeProp?.(Array.from(keys)[0]);
    },
    selectedKeys: selectedKey ? [selectedKey] : undefined,
    defaultSelectedKeys: defaultSelectedKey ? [defaultSelectedKey] : undefined,
  });

  const { groupProps: groupPropsAria } = useToggleButtonGroup(
    {
      ...other,
      isDisabled: disabled,
      selectionMode: 'single',
      disallowEmptySelection: true,
      onSelectionChange: (keys) => {
        onSelectionChangeProp?.(Array.from(keys)[0]);
      },
      selectedKeys: selectedKey ? [selectedKey] : undefined,
      defaultSelectedKeys: defaultSelectedKey
        ? [defaultSelectedKey]
        : undefined,
    },
    state,
    domRef
  );

  const selectedKeyState = Array.from(state.selectedKeys)[0];

  // start animation
  useLayoutEffect(() => {
    if (!firstRender && selectedKeyState) setAnimated.on();
  }, [selectedKeyState, firstRender]);

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
    other,
    groupPropsAria
  );

  const thumbProps = mergeProps(
    {
      ref: thumbRef,
      className: clsx(s.thumb),
      style: {
        inlineSize: `${selectedRect?.width}px`,
        transform: `translateX(${leftRelativeToParent}px)`,
      },
    },
    slotProps?.thumb
  );

  const containerProps = mergeProps(
    {
      className: clsx(s.container),
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
      }}
    >
      <div {...groupProps}>
        {selectedRect && animated && <div {...thumbProps} />}
        <div {...containerProps}>{children}</div>
      </div>
    </ButtonToggleGroupContext.Provider>
  );
});

ButtonToggleGroup.displayName = 'ButtonToggleGroup';
