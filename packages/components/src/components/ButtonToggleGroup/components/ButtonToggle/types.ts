import type { ComponentPropsWithRef, ComponentRef, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

import type { TooltipProps } from '../../../Tooltip';

export type ButtonToggleKey = string | number;

export type ButtonToggleProps = ExtendableComponentPropsWithRef<
  {
    /** An identifier for the item in the selectedKey of a ButtonToggleGroup. */
    id: ButtonToggleKey;
    /** Icon placed before the children. */
    icon?: ReactNode;
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /** Additional CSS-classes. */
    className?: string;
    /** The props used for each slot inside. */
    slotProps?: {
      tooltip?: TooltipProps;
      icon?: ComponentPropsWithRef<'span'> & DataAttributeProps;
      content?: ComponentPropsWithRef<'span'> & DataAttributeProps;
      container?: ComponentPropsWithRef<'span'> & DataAttributeProps;
    };
  },
  'div'
>;

export type ButtonToggleRef = ComponentRef<'button'>;
