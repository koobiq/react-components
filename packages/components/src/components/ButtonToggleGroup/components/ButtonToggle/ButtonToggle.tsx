import { useRef } from 'react';

import { clsx, useFocusRing, mergeProps } from '@koobiq/react-core';
import { useToggleButtonGroupItem } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { useButtonToggleGroupContext } from '../../ButtonToggleGroupContext';

import s from './ButtonToggle.module.css';
import type { ButtonToggleProps } from './types';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export const ButtonToggle = (props: ButtonToggleProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const state = useButtonToggleGroupContext()!;

  const {
    buttonProps,
    isPressed,
    isSelected: selected,
  } = useToggleButtonGroupItem(props, state, ref);

  const { focusProps, isFocusVisible: focusVisible } = useFocusRing({});

  return (
    <button
      {...mergeProps(focusProps, buttonProps)}
      className={clsx(
        s.base,
        selected && s.selected,
        focusVisible && s.focusVisible,
        textNormalMedium
      )}
      data-pressed={isPressed}
      data-selected={selected}
      ref={ref}
    >
      {props.children}
    </button>
  );
};
