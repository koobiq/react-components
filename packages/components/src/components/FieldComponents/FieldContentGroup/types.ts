import type { ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import type { FieldAddonProps } from '../FieldAddon';

export const fieldInputGroupPropVariant = ['filled', 'transparent'] as const;

export type FieldInputGroupPropVariant =
  (typeof fieldInputGroupPropVariant)[number];

export type FieldInputGroupProps = ExtendableComponentPropsWithRef<
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
    variant?: FieldInputGroupPropVariant;
    /** Whether the input is disabled. */
    isDisabled?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** Whether the input value is invalid. */
    isInvalid?: boolean;
    /** The props used for each slot inside. */
    slotProps?: {
      startAddon?: FieldAddonProps;
      endAddon?: FieldAddonProps;
    };
  },
  'div'
>;
