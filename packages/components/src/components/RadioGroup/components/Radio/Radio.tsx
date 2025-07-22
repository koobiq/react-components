import { type ComponentRef } from 'react';
import { forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { IconCircleXs16 } from '@koobiq/react-icons';
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
      isDisabled: isDisabledProp,
      disabled,
      children,
      slotProps,
      className,
      ...other
    } = props;

    const isDisabled = isDisabledProp ?? disabled ?? false;

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'Radio: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    const { size: sizeState } = useRadioGroupState();

    const size = sizeProp || sizeState || 'normal';

    const commonProps: RadioPropsPrimitive = {
      isDisabled,
      className: ({
        isInvalid,
        isSelected,
        isHovered,
        isDisabled,
        isFocusVisible,
      }) =>
        clsx(
          s.base,
          s[size],
          s[labelPlacement],
          isInvalid && s.invalid,
          isHovered && s.hovered,
          isDisabled && s.disabled,
          isSelected && s.selected,
          isFocusVisible && s.focusVisible,
          className
        ),
      ...other,
    };

    const circleProps = mergeProps({ className: s.circle }, slotProps?.circle);
    const labelProps = slotProps?.label;

    return (
      <RadioPrimitive
        {...commonProps}
        data-size={size}
        data-label-placement={labelPlacement}
        ref={ref}
      >
        <span {...circleProps}>
          <IconCircleXs16 className={s.icon} />
        </span>
        {isNotNil(children) && <span {...labelProps}>{children}</span>}
      </RadioPrimitive>
    );
  }
);

Radio.displayName = 'Radio';
