import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaToggleButtonGroupProps } from '@koobiq/react-primitives';

export type ButtonToggleGroupBaseProps = Omit<
  AriaToggleButtonGroupProps,
  'isDisabled'
> & {
  children?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  equalItemSize?: boolean;
};

export type ButtonToggleGroupProps = ExtendableComponentPropsWithRef<
  ButtonToggleGroupBaseProps,
  'div'
>;

export type ButtonToggleGroupRef = ComponentRef<'div'>;
