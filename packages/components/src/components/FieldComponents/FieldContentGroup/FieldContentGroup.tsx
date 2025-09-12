import type { ReactNode, ComponentRef } from 'react';
import { forwardRef, Children, isValidElement, cloneElement } from 'react';

import { clsx, useFocusRing, mergeProps, isNotNil } from '@koobiq/react-core';
import { Group } from '@koobiq/react-primitives';

import { FieldAddon } from '../FieldAddon';

import s from './FieldContentGroup.module.css';
import { FieldContentGroupContext } from './FieldContentGroupContext';
import type { FieldContentGroupProps } from './index';

export const FieldContentGroup = forwardRef<
  ComponentRef<'div'>,
  FieldContentGroupProps
>(function FieldContentGroup(
  {
    variant = 'filled',
    isInvalid,
    isDisabled,
    children,
    className,
    startAddon,
    endAddon,
    slotProps,
    ...other
  },
  ref
) {
  const hasStartAddon = isNotNil(startAddon);
  const hasEndAddon = isNotNil(endAddon);
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
            hasStartAddon,
            hasEndAddon,
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
