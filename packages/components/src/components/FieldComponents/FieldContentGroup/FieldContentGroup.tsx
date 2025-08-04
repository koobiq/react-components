import { type ComponentRef, forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { Group, useInputContext } from '@koobiq/react-primitives';

import { FieldAddon } from '../FieldAddon';

import s from './FieldContentGroup.module.css';
import { FieldContentGroupContext } from './FieldContentGroupContext';
import type { FieldInputGroupProps } from './index';

export const FieldContentGroup = forwardRef<
  ComponentRef<'div'>,
  FieldInputGroupProps
>(
  (
    {
      variant = 'filled',
      isInvalid = false,
      isDisabled = false,
      children,
      className,
      startAddon,
      endAddon,
      slotProps,
      ...other
    },
    ref
  ) => {
    const { value } = useInputContext();
    const hasStartAddon = !!startAddon;
    const hasEndAddon = !!endAddon;
    const hasValue = isNotNil(value);

    return (
      <Group
        className={clsx(
          s.base,
          s[variant],
          isInvalid && s.invalid,
          isDisabled && s.disabled,
          hasStartAddon && s.hasStartAddon,
          hasEndAddon && s.hasEndAddon,
          className
        )}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        {...other}
        ref={ref}
      >
        {({ isHovered, isFocusWithin, isDisabled, isInvalid }) => (
          <FieldContentGroupContext.Provider
            value={{
              hasValue,
              isHovered,
              isInvalid,
              isDisabled,
              isFocusWithin,
            }}
          >
            <FieldAddon
              placement="start"
              isInvalid={isInvalid}
              isDisabled={isDisabled}
              {...slotProps?.startAddon}
            >
              {startAddon}
            </FieldAddon>
            {children}
            <FieldAddon
              placement="end"
              isInvalid={isInvalid}
              isDisabled={isDisabled}
              {...slotProps?.endAddon}
            >
              {endAddon}
            </FieldAddon>
          </FieldContentGroupContext.Provider>
        )}
      </Group>
    );
  }
);

FieldContentGroup.displayName = 'FieldContentGroup';
