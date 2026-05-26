import type { ComponentRef, ReactNode } from 'react';

import type {
  DOMAttributes,
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

import type { FormFieldAddonProps } from '../FormFieldAddon';

export type FormFieldControlGroupRenderProps = {
  /** Attach to the element that should drive the group's focus-ring. */
  focusProps: DOMAttributes;
};

export type FormFieldControlGroupPropChildren =
  | ReactNode
  | ((props: FormFieldControlGroupRenderProps) => ReactNode);

export const formFieldControlGroupPropVariant = [
  'filled',
  'transparent',
] as const;

export type FormFieldControlGroupPropVariant =
  (typeof formFieldControlGroupPropVariant)[number];

export type FormFieldControlGroupProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: FormFieldControlGroupPropChildren;
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
  } & DataAttributeProps,
  'div'
>;

export type FormFieldControlGroupRef = ComponentRef<'div'>;
