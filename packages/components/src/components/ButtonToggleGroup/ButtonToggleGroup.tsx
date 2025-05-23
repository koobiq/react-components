'use client';

import { useRef, forwardRef, useEffect, useReducer } from 'react';

import { once } from '@koobiq/logger';
import { clsx, useDOMRef, mergeProps } from '@koobiq/react-core';
import {
  useToggleGroupState,
  useToggleButtonGroup,
} from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';

import s from './ButtonToggleGroup.module.css';
import { ButtonToggleGroupContext } from './ButtonToggleGroupContext';
import { animationReducer, initialAnimationState } from './reducer';
import type { ButtonToggleGroupProps, ButtonToggleGroupRef } from './types';
import { getSelectedToggleButton, getToggleButtonStyle } from './utils';

const MAX_ITEMS = 5;

export const ButtonToggleGroup = forwardRef<
  ButtonToggleGroupRef,
  ButtonToggleGroupProps
>((props, ref) => {
  const {
    isBlock = false,
    isDisabled = false,
    hasEqualItemSize = false,
    style,
    className,
    slotProps,
    defaultSelectedKey,
    children,
    selectedKey: selectedKeyProp,
    onSelectionChange: onSelectionChangeProp,
    ...other
  } = props;

  if (
    process.env.NODE_ENV !== 'production' &&
    children?.length &&
    children?.length > MAX_ITEMS
  ) {
    once.warn(
      `Use a ButtonToggleGroup to allow selection of up to ${MAX_ITEMS} options.`
    );
  }

  const domRef = useDOMRef<ButtonToggleGroupRef>(ref);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const state = useToggleGroupState({
    ...other,
    isDisabled,
    disallowEmptySelection: true,
    onSelectionChange: (keys) => {
      onSelectionChangeProp?.(Array.from(keys)[0]);
    },
    defaultSelectedKeys: defaultSelectedKey ? [defaultSelectedKey] : [],
    ...(!defaultSelectedKey && {
      selectedKeys: selectedKeyProp ? [selectedKeyProp] : [],
    }),
  });

  const { groupProps: groupPropsAria } = useToggleButtonGroup(
    {},
    state,
    domRef
  );

  // Track previous active button
  const previous = useRef<HTMLElement | null>(null);

  const selectedKey = Array.from(state.selectedKeys)[0];

  // Use reducer for animated state
  const [animatedState, dispatch] = useReducer(
    animationReducer,
    initialAnimationState
  );

  const { isAnimated, start, end, savedKey } = animatedState;

  useEffect(() => {
    const active = getSelectedToggleButton(domRef.current);

    if (active && previous.current) {
      dispatch({
        type: 'SET_ANIMATED',
        payload: {
          start: [previous.current.offsetLeft, previous.current.offsetWidth],
          end: [active.offsetLeft, active.offsetWidth],
        },
      });
    } else {
      dispatch({ type: 'SET_SAVED', payload: { savedKey: selectedKey } });
    }

    previous.current = active;
  }, [selectedKey]);

  useEffect(() => {
    if (!selectedKey) dispatch({ type: 'RESET' });
  }, [selectedKey]);

  const groupProps = mergeProps(
    {
      className: clsx(
        s.base,
        isBlock && s.block,
        hasEqualItemSize && s.hasEqualItemSize,
        className
      ),
      'data-block': isBlock,
      'data-animated': isAnimated,
      'data-equal-item-size': hasEqualItemSize,
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
      style: getToggleButtonStyle(start, end),
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
    <ButtonToggleGroupContext.Provider value={{ state, savedKey }}>
      <div {...groupProps}>
        <Transition
          in={isAnimated}
          timeout={200}
          nodeRef={thumbRef}
          exit={false}
          onEntered={() => {
            dispatch({ type: 'SET_SAVED', payload: { savedKey: selectedKey } });
          }}
          mountOnEnter
          unmountOnExit
          enter
        >
          {(transitionState) => (
            <div {...thumbProps} data-transition={transitionState} />
          )}
        </Transition>
        <div {...containerProps}>{children}</div>
      </div>
    </ButtonToggleGroupContext.Provider>
  );
});

ButtonToggleGroup.displayName = 'ButtonToggleGroup';
