'use client';

import { type ComponentRef, forwardRef } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import {
  Toggle as TogglePrimitive,
  type ToggleProps as TogglePropsPrimitive,
} from '@koobiq/react-primitives';

import type { ToggleProps } from './index';
import s from './Toggle.module.css';

export const Toggle = forwardRef<ComponentRef<'label'>, ToggleProps>(
  (props, ref) => {
    const {
      size = 'normal',
      labelPlacement = 'end',
      children,
      slotProps,
      className,
      ...other
    } = props;

    const commonProps: TogglePropsPrimitive = {
      className: ({ checked, hovered, focusVisible, disabled, error }) =>
        clsx(
          s.base,
          s[size],
          error && s.error,
          s[labelPlacement],
          hovered && s.hovered,
          checked && s.checked,
          disabled && s.disabled,
          focusVisible && s.focusVisible,
          className
        ),
      ...other,
    };

    const trackProps = mergeProps({ className: s.track }, slotProps?.track);
    const labelProps = slotProps?.label;

    return (
      <TogglePrimitive {...commonProps} ref={ref}>
        <span {...trackProps} />
        {isNotNil(children) && <span {...labelProps}>{children}</span>}
      </TogglePrimitive>
    );
  }
);

Toggle.displayName = 'Toggle';
