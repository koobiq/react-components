'use client';

import { forwardRef, type ComponentRef } from 'react';

import { deprecate } from '@koobiq/logger';
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
    const {
      size,
      label,
      children,
      slotProps,
      description,
      orientation,
      isInvalid: isInvalidProp,
      isDisabled: isDisabledProp,
      isRequired: isRequiredProp,
      isReadOnly: isReadOnlyProp,
      disabled,
      error,
      readonly,
      required,
    } = props;

    const isDisabled = isDisabledProp ?? disabled ?? false;
    const isInvalid = isInvalidProp ?? error ?? false;
    const isReadOnly = isReadOnlyProp ?? readonly ?? false;
    const isRequired = isRequiredProp ?? required ?? false;

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'RadioGroup: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'error' in props) {
      deprecate(
        'RadioGroup: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
      deprecate(
        'RadioGroup: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'required' in props) {
      deprecate(
        'RadioGroup: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
      );
    }

    const commonRootProps = mergeProps(
      { ...props, isDisabled, isInvalid, isReadOnly, isRequired },
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
