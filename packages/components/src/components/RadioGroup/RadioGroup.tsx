import { forwardRef, type ComponentRef } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import { RadioGroup as RadioGroupPrimitive } from '@koobiq/react-primitives';

import { flex } from '../layout';

import {
  RadioGroupLabel,
  RadioGroupContext,
  RadioGroupDescription,
} from './index';
import type { RadioGroupProps } from './index';

export const RadioGroup = forwardRef<ComponentRef<'div'>, RadioGroupProps>(
  (props, ref) => {
    const { size, label, children, slotProps, description, orientation } =
      props;

    const commonRootProps = mergeProps(
      props,
      {
        className: clsx(
          flex({
            direction: orientation === 'horizontal' ? 'row' : 'column',
            alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
            gap: 'm',
          })
        ),
      },
      slotProps?.root
    );

    return (
      <RadioGroupPrimitive {...commonRootProps} ref={ref}>
        <RadioGroupLabel {...slotProps?.label}>{label}</RadioGroupLabel>
        <RadioGroupContext.Provider value={{ size }}>
          {children}
        </RadioGroupContext.Provider>
        <RadioGroupDescription {...slotProps?.description}>
          {description}
        </RadioGroupDescription>
      </RadioGroupPrimitive>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
