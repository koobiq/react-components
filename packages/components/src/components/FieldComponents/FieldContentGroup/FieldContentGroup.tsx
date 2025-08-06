import type { ReactNode, ComponentRef } from 'react';
import { forwardRef, Children, isValidElement, cloneElement } from 'react';

import { clsx, isNotNil, useFocusRing, mergeProps } from '@koobiq/react-core';
import { Group, useInputContext } from '@koobiq/react-primitives';

import { FieldAddon } from '../FieldAddon';

import s from './FieldContentGroup.module.css';
import { FieldContentGroupContext } from './FieldContentGroupContext';
import type { FieldInputGroupProps } from './index';

export const FieldContentGroup = forwardRef<
  ComponentRef<'div'>,
  FieldInputGroupProps
>(function FieldContentGroup(
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
) {
  const { value } = useInputContext();
  const hasStartAddon = !!startAddon;
  const hasEndAddon = !!endAddon;
  const hasValue = isNotNil(value);
  const { focusProps, isFocused } = useFocusRing({ within: true });

  const focusManagedChildren = Children.map(children, (child: ReactNode) => {
    if (!isValidElement(child)) return child;

    const merged = mergeProps(focusProps, child.props);

    return cloneElement(child, merged);
  });

  return (
    <Group
      className={clsx(
        s.base,
        s[variant],
        isInvalid && s.invalid,
        isDisabled && s.disabled,
        isFocused && s.focused,
        hasStartAddon && s.hasStartAddon,
        hasEndAddon && s.hasEndAddon,
        className
      )}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      {...other}
      ref={ref}
    >
      {({ isHovered, isFocusWithin }) => (
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
          {focusManagedChildren}
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
});

FieldContentGroup.displayName = 'FieldContentGroup';
