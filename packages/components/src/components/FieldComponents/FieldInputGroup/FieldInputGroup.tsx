import { type ComponentRef, forwardRef, type ReactNode } from 'react';

import {
  clsx,
  type ExtendableComponentPropsWithRef,
  isNotNil,
} from '@koobiq/react-core';
import { Group, useInputContext } from '@koobiq/react-primitives';

import { FieldAddon, type FieldAddonProps } from '../FieldAddon';

import s from './FieldInputGroup.module.css';
import { FieldInputGroupContext } from './FieldInputGroupContext';

export type FieldInputGroupProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    disabled?: boolean;
    className?: string;
    error?: boolean;
    /** The props used for each slot inside. */
    slotProps?: {
      start?: FieldAddonProps;
      end?: FieldAddonProps;
    };
  },
  'div'
>;

export const FieldInputGroup = forwardRef<
  ComponentRef<'div'>,
  FieldInputGroupProps
>(
  (
    { children, className, startAddon, endAddon, error, slotProps, ...other },
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
          hasStartAddon && s.hasStartAddon,
          hasEndAddon && s.hasEndAddon,
          className
        )}
        {...other}
        ref={ref}
      >
        {({ hovered, focusWithin, disabled }) => (
          <FieldInputGroupContext.Provider
            value={{ disabled, hovered, hasValue, focusWithin }}
          >
            <FieldAddon placement="start" error={error} {...slotProps?.start}>
              {startAddon}
            </FieldAddon>
            {children}
            <FieldAddon placement="end" error={error} {...slotProps?.end}>
              {endAddon}
            </FieldAddon>
          </FieldInputGroupContext.Provider>
        )}
      </Group>
    );
  }
);

FieldInputGroup.displayName = 'FieldInputGroup';
