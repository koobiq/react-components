import { type ComponentRef } from 'react';
import { forwardRef } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { Radio as RadioPrimitive } from '@koobiq/react-primitives';
import { type RadioProps as RadioPropsPrimitive } from '@koobiq/react-primitives';

import { useRadioGroupState } from '../../index';

import type { RadioProps } from './index';
import s from './Radio.module.css';

export const Radio = forwardRef<ComponentRef<'label'>, RadioProps>(
  (props, ref) => {
    const {
      labelPlacement = 'end',
      size: sizeProp,
      children,
      slotProps,
      className,
      ...other
    } = props;

    const { size: sizeState } = useRadioGroupState();

    const size = sizeProp || sizeState || 'normal';

    const commonProps: RadioPropsPrimitive = {
      className: ({ error, checked, hovered, disabled, focusVisible }) =>
        clsx(
          s.base,
          s[size],
          error && s.error,
          checked && s.checked,
          hovered && s.hovered,
          disabled && s.disabled,
          s[labelPlacement],
          focusVisible && s.focusVisible,
          className
        ),
      ...other,
    };

    const circleProps = mergeProps({ className: s.circle }, slotProps?.circle);
    const labelProps = slotProps?.label;

    return (
      <RadioPrimitive {...commonProps} ref={ref}>
        <span {...circleProps} />
        {isNotNil(children) && <span {...labelProps}>{children}</span>}
      </RadioPrimitive>
    );
  }
);

Radio.displayName = 'Radio';
