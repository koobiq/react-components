import type { ComponentPropsWithRef, ComponentRef, ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { AriaToggleButtonGroupItemProps } from '@koobiq/react-primitives';

export type ButtonToggleProps = Omit<
  AriaToggleButtonGroupItemProps,
  'isDisabled'
> & {
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
    icon?: ComponentPropsWithRef<'span'> & DataAttributeProps;
    content?: ComponentPropsWithRef<'span'> & DataAttributeProps;
    container?: ComponentPropsWithRef<'span'> & DataAttributeProps;
  };
};

export type ButtonToggleRef = ComponentRef<'button'>;
