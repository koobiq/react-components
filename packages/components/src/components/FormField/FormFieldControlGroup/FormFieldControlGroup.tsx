import type { ReactNode } from 'react';
import { forwardRef, Children, isValidElement, cloneElement } from 'react';

import { clsx, useFocusRing, mergeProps, isNotNil } from '@koobiq/react-core';
import { Group } from '@koobiq/react-primitives';

import { FormFieldAddon } from '../FormFieldAddon';

import s from './FormFieldControlGroup.module.css';
import { FormFieldControlGroupContext } from './FormFieldControlGroupContext';
import type {
  FormFieldControlGroupProps,
  FormFieldControlGroupRef,
} from './index';

export const FormFieldControlGroup = forwardRef<
  FormFieldControlGroupRef,
  FormFieldControlGroupProps
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
        <FormFieldControlGroupContext.Provider
          value={{
            hasStartAddon,
            hasEndAddon,
            isHovered,
            isInvalid,
            isDisabled,
            isFocusWithin,
          }}
        >
          <FormFieldAddon
            placement="start"
            isInvalid={isInvalid}
            isDisabled={isDisabled}
            {...slotProps?.startAddon}
          >
            {startAddon}
          </FormFieldAddon>
          {focusManagedChildren}
          <FormFieldAddon
            placement="end"
            isInvalid={isInvalid}
            isDisabled={isDisabled}
            {...slotProps?.endAddon}
          >
            {endAddon}
          </FormFieldAddon>
        </FormFieldControlGroupContext.Provider>
      )}
    </Group>
  );
});

FormFieldControlGroup.displayName = 'FormFieldControlGroup';
