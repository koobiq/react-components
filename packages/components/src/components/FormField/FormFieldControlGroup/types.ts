import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import type { FormFieldAddonProps } from '../FormFieldAddon';

export const formFieldControlGroupPropVariant = [
  'filled',
  'transparent',
] as const;

export type FormFieldControlGroupPropVariant =
  (typeof formFieldControlGroupPropVariant)[number];

export type FormFieldControlGroupProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /**
     * The variant to use.
     * @default 'filled'
     */
    variant?: FormFieldControlGroupPropVariant;
    /** Whether the input is disabled. */
    isDisabled?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Whether the input value is invalid. */
    isInvalid?: boolean;
    /** The props used for each slot inside. */
    slotProps?: {
      startAddon?: FormFieldAddonProps;
      endAddon?: FormFieldAddonProps;
    };
  },
  'div'
>;

export type FormFieldControlGroupRef = ComponentRef<'div'>;
